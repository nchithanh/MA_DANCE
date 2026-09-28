"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
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
import { SeoPagesEditor, SeoSettingsEditor, SeoSitemapPanel } from "@/components/AdminSeo";
import { Badge, Button, Field, Input } from "@/components/admin/ui";
import { ADMIN_TABS, Sidebar, SidebarFrame, tabGroupLabel, type AdminTabId } from "@/components/admin/Sidebar";
import { loginAdminApi, logoutAdminApi, putHomepage, putSeo, syncCatalog, verifyAdminSession } from "@/lib/ma-admin-api";
import { fetchCatalog, fetchHomepage, fetchSeo } from "@/lib/ma-api";
import { type HomeLocale, seedHomepage, type Homepage } from "@/lib/homepage-data";
import { seedSeo, type SeoDoc } from "@/lib/seo-data";
import { catalogToSiteData, emptySiteData, type SiteData } from "@/lib/site-data";
import { siteHref } from "@/lib/media";

function SyncActions({
  dirty,
  busy,
  onReload,
  onSave,
}: {
  dirty: boolean;
  busy: boolean;
  onReload: () => void;
  onSave: () => void;
}) {
  return (
    <>
      <Badge tone={dirty ? "warning" : "success"}>{dirty ? "Chưa lưu" : "Đã đồng bộ"}</Badge>
      <Button variant="secondary" size="sm" onClick={onReload} disabled={busy}>
        Tải lại
      </Button>
      <Button size="sm" onClick={onSave} disabled={busy}>
        Lưu
      </Button>
    </>
  );
}

export function AdminApp() {
  const [booted, setBooted] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<AdminTabId>("homepage");
  const [navOpen, setNavOpen] = useState(false);
  const [draft, setDraft] = useState<SiteData>(emptySiteData);
  const [snapshot, setSnapshot] = useState<SiteData>(emptySiteData);
  const [home, setHome] = useState<Homepage>(seedHomepage);
  const [homeSnap, setHomeSnap] = useState<Homepage>(seedHomepage);
  const [homeLang, setHomeLang] = useState<HomeLocale>("vi");
  const [seo, setSeo] = useState<SeoDoc>(seedSeo);
  const [seoSnap, setSeoSnap] = useState<SeoDoc>(seedSeo);
  const [loginErr, setLoginErr] = useState("");
  const [loadError, setLoadError] = useState("");
  const [overlay, setOverlay] = useState<AdminOverlayState | null>(null);

  const dirty = useMemo(
    () =>
      JSON.stringify(draft) !== JSON.stringify(snapshot) ||
      JSON.stringify(home) !== JSON.stringify(homeSnap) ||
      JSON.stringify(seo) !== JSON.stringify(seoSnap),
    [draft, snapshot, home, homeSnap, seo, seoSnap],
  );
  const busy = overlay?.mode === "busy";
  const current = ADMIN_TABS.find((item) => item.id === tab);

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

  function applySeo(data: SeoDoc) {
    const copy = structuredClone(data);
    setSeo(copy);
    setSeoSnap(structuredClone(copy));
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
      }
      try {
        applySeo(await fetchSeo());
      } catch {
        applySeo(seedSeo());
        setLoadError((prev) => prev || "Không tải được SEO từ Worker — đang mở seed để lưu lại.");
      } finally {
        setBooted(true);
      }
    })();
    return () => document.body.classList.remove("ma-admin-open");
  }, []);

  useEffect(() => {
    if (!navOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setNavOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navOpen]);

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
      try {
        applySeo(await fetchSeo());
      } catch {
        applySeo(seedSeo());
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
    setNavOpen(false);
  }

  async function persist() {
    const token = getAdminToken();
    if (!token) {
      setLoadError("Hết phiên — đăng nhập lại.");
      setAuthed(false);
      return;
    }
    setOverlay({ mode: "busy", title: "Đang lưu lên Worker…", detail: "Catalog + homepage + SEO" });
    try {
      await syncCatalog(token, snapshot, draft);
      await putHomepage(token, home);
      await putSeo(token, seo);
      const catalog = await fetchCatalog();
      applyCatalog(catalogToSiteData(catalog));
      applyHome(await fetchHomepage());
      applySeo(await fetchSeo());
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
    setOverlay({ mode: "busy", title: "Đang tải lại…", detail: "Catalog + homepage + SEO" });
    void Promise.all([fetchCatalog(), fetchHomepage(), fetchSeo()])
      .then(([catalog, homepage, nextSeo]) => {
        applyCatalog(catalogToSiteData(catalog));
        applyHome(homepage);
        applySeo(nextSeo);
        setLoadError("");
        setOverlay({ mode: "ok", title: "Đã tải lại" });
        window.setTimeout(() => setOverlay(null), 1200);
      })
      .catch(() => {
        const detail = "Không tải được catalog / homepage / SEO từ Worker.";
        setLoadError(detail);
        setOverlay({ mode: "err", title: "Tải lại thất bại", detail });
      });
  }

  function selectTab(id: AdminTabId) {
    setTab(id);
    setNavOpen(false);
  }

  const actions = (
    <SyncActions dirty={dirty} busy={busy} onReload={reloadWorker} onSave={() => void persist()} />
  );

  if (!booted) {
    return (
      <div className="ma-admin min-h-dvh bg-ma-bg">
        <AdminOverlay state={{ mode: "busy", title: "Đang tải admin…" }} />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="ma-admin grid min-h-dvh place-items-center bg-ma-bg px-4">
        <form className="grid w-full max-w-sm gap-4 rounded-2xl border border-ma-border bg-ma-card p-6 shadow-[0_16px_40px_rgba(0,0,0,0.28)]" onSubmit={onLogin}>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-[0.625rem] bg-ma-accent text-sm font-semibold text-black">MA</span>
            <span>
              <span className="block text-sm font-semibold tracking-wide">MA ADMIN</span>
              <span className="block text-xs text-ma-text-muted">Edu Dance Studio</span>
            </span>
          </div>
          <div>
            <h1 className="text-xl font-medium">Đăng nhập</h1>
            <p className="mt-1 text-sm text-ma-text-secondary">Phiên làm việc 7 ngày, chỉ trên trình duyệt này.</p>
          </div>
          <Field label="Tài khoản">
            <Input id="admin-user" name="user" type="text" autoComplete="username" required disabled={busy} />
          </Field>
          <Field label="Mật khẩu">
            <Input id="admin-pass" name="pass" type="password" autoComplete="current-password" required disabled={busy} />
          </Field>
          {loginErr ? <p className="text-sm text-ma-danger">{loginErr}</p> : null}
          <Button type="submit" disabled={busy}>
            Vào
          </Button>
          <a href={siteHref("/")} className="text-center text-sm text-ma-text-secondary hover:text-ma-text">
            Về site
          </a>
        </form>
        <AdminOverlay state={overlay} onDismiss={() => setOverlay(null)} />
      </div>
    );
  }

  return (
    <div className="ma-admin flex min-h-dvh bg-ma-bg text-ma-text">
      <SidebarFrame>
        <Sidebar tab={tab} onTab={selectTab} onLogout={() => void onLogout()} />
      </SidebarFrame>

      {navOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" className="absolute inset-0 bg-black/60" aria-label="Đóng menu" onClick={() => setNavOpen(false)} />
          <aside className="relative flex h-full w-[min(16.25rem,calc(100svw-2.5rem))] flex-col bg-ma-card shadow-[0_16px_40px_rgba(0,0,0,0.45)]">
            <button
              type="button"
              className="absolute right-3 top-4 grid size-8 place-items-center rounded-xl text-ma-text-secondary hover:bg-ma-card-hover hover:text-ma-text"
              aria-label="Đóng menu"
              onClick={() => setNavOpen(false)}
            >
              <X className="size-4" />
            </button>
            <Sidebar tab={tab} onTab={selectTab} onLogout={() => void onLogout()} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-ma-border bg-ma-bg/80 px-4 py-3 backdrop-blur-md lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="grid size-9 place-items-center rounded-xl border border-ma-border text-ma-text-secondary hover:bg-ma-card-hover hover:text-ma-text lg:hidden"
              aria-label="Mở menu"
              onClick={() => setNavOpen(true)}
            >
              <Menu className="size-4" />
            </button>
            <div className="min-w-0">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-ma-text-muted">
                {tabGroupLabel(tab)} / {current?.label}
              </p>
              <h1 className="truncate text-lg font-medium">{current?.label}</h1>
            </div>
          </div>
          <div className="hidden items-center gap-2 lg:flex">{actions}</div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 pb-28 lg:px-8 lg:pb-10">
          {loadError ? <p className="mb-4 text-sm text-ma-danger">{loadError}</p> : null}
          <Panel tab={tab} home={home} homeLang={homeLang} setHomeLang={setHomeLang} setHome={setHome} draft={draft} setDraft={setDraft} seo={seo} setSeo={setSeo} selectTab={selectTab} setOverlay={setOverlay} />
        </main>

        <div className="sticky bottom-0 z-30 flex items-center justify-end gap-2 border-t border-ma-border bg-ma-bg/90 px-4 py-3 backdrop-blur-md lg:hidden">
          {actions}
        </div>
      </div>
      <AdminOverlay state={overlay} onDismiss={() => setOverlay(null)} />
    </div>
  );
}

function Panel({
  tab,
  home,
  homeLang,
  setHomeLang,
  setHome,
  draft,
  setDraft,
  seo,
  setSeo,
  selectTab,
  setOverlay,
}: {
  tab: AdminTabId;
  home: Homepage;
  homeLang: HomeLocale;
  setHomeLang: (lang: HomeLocale) => void;
  setHome: (next: Homepage) => void;
  draft: SiteData;
  setDraft: (next: SiteData) => void;
  seo: SeoDoc;
  setSeo: (next: SeoDoc) => void;
  selectTab: (id: AdminTabId) => void;
  setOverlay: (state: AdminOverlayState | null) => void;
}): ReactNode {
  if (tab === "homepage") {
    return (
      <HomepageEditor
        home={home}
        lang={homeLang}
        onLang={setHomeLang}
        onChange={setHome}
        onGoTab={(next) => selectTab(next)}
        onBusy={setOverlay}
      />
    );
  }
  if (tab === "courses") {
    return (
      <CoursesEditor courses={draft.courses} branches={draft.branches} onChange={(courses) => setDraft({ ...draft, courses })} />
    );
  }
  if (tab === "rooms") {
    return (
      <RoomsEditor branches={draft.branches} onChange={(branches) => setDraft({ ...draft, branches })} onBusy={setOverlay} />
    );
  }
  if (tab === "packages") {
    return <PackagesEditor packages={draft.packages} onChange={(next) => setDraft({ ...draft, packages: next })} />;
  }
  if (tab === "stories") {
    return <StoriesEditor stories={draft.stories} onChange={(stories) => setDraft({ ...draft, stories })} onBusy={setOverlay} />;
  }
  if (tab === "branches") {
    return <BranchesEditor branches={draft.branches} onChange={(branches) => setDraft({ ...draft, branches })} />;
  }
  if (tab === "seo-pages") {
    return <SeoPagesEditor seo={seo} stories={draft.stories} onChange={setSeo} onBusy={setOverlay} />;
  }
  if (tab === "seo-settings") {
    return <SeoSettingsEditor seo={seo} onChange={setSeo} onBusy={setOverlay} />;
  }
  return <SeoSitemapPanel seo={seo} stories={draft.stories} />;
}
