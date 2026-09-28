"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { getAdminToken, logoutAdmin, setAdminSession } from "@/lib/admin-auth";
import {
  BranchesEditor,
  CoursesEditor,
  PackagesEditor,
  RoomsEditor,
  StoriesEditor,
} from "@/components/AdminCatalog";
import { AdminOverlay, type AdminOverlayState } from "@/components/AdminOverlay";
import { HomepageEditor } from "@/components/HomepageEditor";
import { loginAdminApi, logoutAdminApi, putHomepage, syncCatalog, verifyAdminSession } from "@/lib/ma-admin-api";
import { fetchCatalog, fetchHomepage } from "@/lib/ma-api";
import { type HomeLocale, seedHomepage, type Homepage } from "@/lib/homepage-data";
import { catalogToSiteData, emptySiteData, type SiteData } from "@/lib/site-data";
import { siteHref } from "@/lib/media";

type TabId = "homepage" | "courses" | "rooms" | "packages" | "stories" | "branches";

const NAV_GROUPS: { label: string; items: { id: TabId; label: string }[] }[] = [
  {
    label: "Trang chủ",
    items: [{ id: "homepage", label: "Homepage" }],
  },
  {
    label: "Catalog",
    items: [
      { id: "courses", label: "Khóa học" },
      { id: "rooms", label: "Phòng" },
      { id: "packages", label: "Gói" },
      { id: "stories", label: "Stories" },
      { id: "branches", label: "Chi nhánh" },
    ],
  },
];

const TABS = NAV_GROUPS.flatMap((group) => group.items);

function SideFoot({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="mt-auto d-grid gap-2 pt-3">
      <a className="btn btn-sm btn-outline-secondary" href={siteHref("/")}>
        Về site
      </a>
      <button type="button" className="btn btn-sm btn-outline-danger" onClick={onLogout}>
        Đăng xuất
      </button>
    </div>
  );
}

function SideNav({ tab, onTab }: { tab: TabId; onTab: (id: TabId) => void }) {
  return (
    <nav aria-label="Admin sections" className="d-grid gap-3">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="admin-kicker text-uppercase text-secondary fw-bold mb-2">{group.label}</p>
          <div className="list-group list-group-flush">
            {group.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`list-group-item list-group-item-action rounded ${tab === item.id ? "active" : ""}`}
                aria-current={tab === item.id ? "page" : undefined}
                onClick={() => onTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AdminApp() {
  const [booted, setBooted] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<TabId>("homepage");
  const [navOpen, setNavOpen] = useState(false);
  const [draft, setDraft] = useState<SiteData>(emptySiteData);
  const [snapshot, setSnapshot] = useState<SiteData>(emptySiteData);
  const [home, setHome] = useState<Homepage>(seedHomepage);
  const [homeSnap, setHomeSnap] = useState<Homepage>(seedHomepage);
  const [homeLang, setHomeLang] = useState<HomeLocale>("vi");
  const [loginErr, setLoginErr] = useState("");
  const [loadError, setLoadError] = useState("");
  const [overlay, setOverlay] = useState<AdminOverlayState | null>(null);

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(snapshot) || JSON.stringify(home) !== JSON.stringify(homeSnap),
    [draft, snapshot, home, homeSnap],
  );
  const busy = overlay?.mode === "busy";

  function applyCatalog(data: SiteData) {
    const copy = structuredClone(data);
    setDraft(copy);
    setSnapshot(structuredClone(copy));
  }

  function applyHome(data: Homepage) {
    const copy = structuredClone(data);
    setHome(copy);
    setHomeSnap(structuredClone(copy));
  }

  useEffect(() => {
    document.body.classList.add("ma-admin-open");
    const token = getAdminToken();
    void (async () => {
      if (token) {
        try {
          await verifyAdminSession(token);
          setAuthed(true);
        } catch {
          logoutAdmin();
          setAuthed(false);
        }
      } else {
        setAuthed(false);
      }
      try {
        const catalog = await fetchCatalog();
        applyCatalog(catalogToSiteData(catalog));
        setLoadError("");
      } catch {
        applyCatalog(emptySiteData());
        setLoadError("Không tải được catalog từ Worker.");
      }
      try {
        applyHome(await fetchHomepage());
      } catch {
        applyHome(seedHomepage());
        setLoadError((prev) => prev || "Không tải được homepage từ Worker — đang mở seed để lưu lại.");
      } finally {
        setBooted(true);
      }
    })();
    return () => document.body.classList.remove("ma-admin-open");
  }, []);

  async function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const user = String(fd.get("user") || "").trim();
    const pass = String(fd.get("pass") || "");
    if (!user || !pass) {
      setLoginErr("Nhập tài khoản và mật khẩu.");
      return;
    }
    setOverlay({ mode: "busy", title: "Đang đăng nhập…", detail: "Tạo session trên Worker" });
    try {
      const token = await loginAdminApi(user, pass);
      setAdminSession(token);
      setAuthed(true);
      setLoginErr("");
      const catalog = await fetchCatalog();
      applyCatalog(catalogToSiteData(catalog));
      try {
        applyHome(await fetchHomepage());
      } catch {
        applyHome(seedHomepage());
      }
      setLoadError("");
      setOverlay(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "login_failed";
      const detail = message === "invalid_credentials" ? "Sai tài khoản hoặc mật khẩu." : message;
      setLoginErr(detail);
      setOverlay({ mode: "err", title: "Không đăng nhập được", detail });
    }
  }

  async function onLogout() {
    const token = getAdminToken();
    if (token) {
      try {
        await logoutAdminApi(token);
      } catch {
        // still clear local session
      }
    }
    logoutAdmin();
    setAuthed(false);
  }

  async function persist() {
    const token = getAdminToken();
    if (!token) {
      setLoadError("Hết phiên — đăng nhập lại.");
      setAuthed(false);
      return;
    }
    setOverlay({ mode: "busy", title: "Đang lưu lên Worker…", detail: "Catalog + homepage" });
    try {
      await syncCatalog(token, snapshot, draft);
      await putHomepage(token, home);
      const catalog = await fetchCatalog();
      applyCatalog(catalogToSiteData(catalog));
      applyHome(await fetchHomepage());
      setLoadError("");
      setOverlay({ mode: "ok", title: "Đã lưu" });
      window.setTimeout(() => setOverlay(null), 1400);
    } catch (err) {
      const message = err instanceof Error ? err.message : "save_failed";
      setLoadError(`Không lưu được: ${message}`);
      setOverlay({ mode: "err", title: "Không lưu được", detail: message });
    }
  }

  function reloadWorker() {
    if (!window.confirm("Bỏ chỉnh chưa lưu và tải lại từ Worker?")) return;
    setOverlay({ mode: "busy", title: "Đang tải lại…", detail: "Catalog + homepage" });
    void Promise.all([fetchCatalog(), fetchHomepage()])
      .then(([catalog, homepage]) => {
        applyCatalog(catalogToSiteData(catalog));
        applyHome(homepage);
        setLoadError("");
        setOverlay({ mode: "ok", title: "Đã tải lại" });
        window.setTimeout(() => setOverlay(null), 1200);
      })
      .catch(() => {
        const detail = "Không tải được catalog / homepage từ Worker.";
        setLoadError(detail);
        setOverlay({ mode: "err", title: "Tải lại thất bại", detail });
      });
  }

  function selectTab(id: TabId) {
    setTab(id);
    setNavOpen(false);
  }

  const actions = (
    <>
      <span className={`badge ${dirty ? "text-bg-warning" : "text-bg-success"}`}>{dirty ? "Chưa lưu" : "Đã đồng bộ"}</span>
      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={reloadWorker} disabled={busy}>
        Tải lại
      </button>
      <button type="button" className="btn btn-sm btn-primary" onClick={() => void persist()} disabled={busy}>
        Lưu
      </button>
    </>
  );

  if (!booted) {
    return (
      <div className="ma-admin accordion min-vh-100 bg-body" data-bs-theme="dark">
        <AdminOverlay state={{ mode: "busy", title: "Đang tải admin…" }} />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="ma-admin accordion min-vh-100 bg-body d-flex align-items-center justify-content-center p-3" data-bs-theme="dark">
        <form className="card shadow-sm" style={{ width: "min(22rem, 100%)" }} onSubmit={onLogin}>
          <div className="card-body d-grid gap-3">
            <p className="admin-kicker text-uppercase fw-bold mb-0">MA Admin</p>
            <h1 className="h3 mb-0">Đăng nhập</h1>
            <p className="text-secondary small mb-0">Worker tạo session token (7 ngày). Chỉ lưu trên trình duyệt này.</p>
            <div>
              <label className="form-label" htmlFor="admin-user">
                Tài khoản
              </label>
              <input
                id="admin-user"
                className="form-control"
                name="user"
                type="text"
                autoComplete="username"
                required
                disabled={busy}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="admin-pass">
                Mật khẩu
              </label>
              <input
                id="admin-pass"
                className="form-control"
                name="pass"
                type="password"
                autoComplete="current-password"
                required
                disabled={busy}
              />
            </div>
            {loginErr ? <p className="text-danger small mb-0">{loginErr}</p> : null}
            <button type="submit" className="btn btn-primary" disabled={busy}>
              Vào
            </button>
            <a className="link-secondary text-center small" href={siteHref("/")}>
              Về site
            </a>
          </div>
        </form>
        <AdminOverlay state={overlay} onDismiss={() => setOverlay(null)} />
      </div>
    );
  }

  return (
    <div className="ma-admin accordion d-flex min-vh-100 bg-body text-body" data-bs-theme="dark">
      <aside className="admin-side d-none d-lg-flex flex-column border-end bg-body-tertiary p-3 sticky-top">
        <p className="admin-kicker text-uppercase fw-bold mb-3">MA Admin</p>
        <SideNav tab={tab} onTab={selectTab} />
        <SideFoot onLogout={() => void onLogout()} />
      </aside>

      <div
        className={`offcanvas offcanvas-start d-lg-none bg-body-tertiary ${navOpen ? "show" : ""}`}
        tabIndex={-1}
        aria-hidden={navOpen ? undefined : true}
        style={navOpen ? { visibility: "visible" } : undefined}
      >
        <div className="offcanvas-header border-bottom">
          <p className="offcanvas-title admin-kicker text-uppercase fw-bold mb-0">MA Admin</p>
          <button type="button" className="btn-close" aria-label="Đóng menu" onClick={() => setNavOpen(false)} />
        </div>
        <div className="offcanvas-body d-flex flex-column">
          <SideNav tab={tab} onTab={selectTab} />
          <SideFoot onLogout={() => void onLogout()} />
        </div>
      </div>
      {navOpen ? (
        <button
          type="button"
          className="offcanvas-backdrop fade show d-lg-none border-0"
          aria-label="Đóng menu"
          onClick={() => setNavOpen(false)}
        />
      ) : null}

      <div className="flex-grow-1 min-w-0 d-flex flex-column">
        <header className="sticky-top border-bottom bg-body px-3 py-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary d-lg-none"
              aria-label="Mở menu"
              onClick={() => setNavOpen(true)}
            >
              Menu
            </button>
            <div>
              <p className="admin-kicker text-uppercase text-secondary fw-bold mb-1">
                {tab === "homepage" ? "Trang chủ" : "Catalog"}
              </p>
              <h1 className="h4 mb-0">{TABS.find((item) => item.id === tab)?.label}</h1>
            </div>
          </div>
          <div className="d-none d-lg-flex flex-wrap align-items-center gap-2">{actions}</div>
        </header>

        <main className="admin-main p-3 pb-5">
          <p className="text-secondary small">
            GET / Lưu qua Worker. Homepage: copy + ảnh theo section (VI/EN/KR). Catalog: khóa / phòng / gói /
            stories / chi nhánh. Public không fallback HTML.
          </p>
          {loadError ? <p className="text-danger small">{loadError}</p> : null}

          {tab === "homepage" ? (
            <HomepageEditor
              home={home}
              lang={homeLang}
              onLang={setHomeLang}
              onChange={setHome}
              onGoTab={(next) => selectTab(next)}
              onBusy={setOverlay}
            />
          ) : null}
          {tab === "courses" ? (
            <CoursesEditor
              courses={draft.courses}
              branches={draft.branches}
              onChange={(courses) => setDraft({ ...draft, courses })}
            />
          ) : null}
          {tab === "rooms" ? (
            <RoomsEditor
              branches={draft.branches}
              onChange={(branches) => setDraft({ ...draft, branches })}
              onBusy={setOverlay}
            />
          ) : null}
          {tab === "packages" ? (
            <PackagesEditor
              packages={draft.packages}
              onChange={(next) => setDraft({ ...draft, packages: next })}
            />
          ) : null}
          {tab === "stories" ? (
            <StoriesEditor
              stories={draft.stories}
              onChange={(stories) => setDraft({ ...draft, stories })}
              onBusy={setOverlay}
            />
          ) : null}
          {tab === "branches" ? (
            <BranchesEditor
              branches={draft.branches}
              onChange={(branches) => setDraft({ ...draft, branches })}
            />
          ) : null}
        </main>

        <div className="d-lg-none sticky-bottom border-top bg-body px-3 py-2 d-flex justify-content-end gap-2">
          {actions}
        </div>
      </div>
      <AdminOverlay state={overlay} onDismiss={() => setOverlay(null)} />
    </div>
  );
}
