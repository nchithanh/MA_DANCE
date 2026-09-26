"use client";

import { useEffect, useState, type FormEvent } from "react";
import { isAdminSession, loginAdmin, logoutAdmin } from "@/lib/admin-auth";
import {
  loadSiteData,
  resetSiteData,
  saveSiteData,
  seedSiteData,
  type SiteData,
} from "@/lib/site-data";
import type { Branch, BranchId, Course, Package, Room } from "@/lib/discovery-data";
import type { Story, StoryKind } from "@/lib/stories";
import { siteHref } from "@/lib/media";

const TABS = [
  { id: "courses", label: "Khóa học" },
  { id: "rooms", label: "Phòng" },
  { id: "packages", label: "Gói" },
  { id: "stories", label: "Stories" },
  { id: "branches", label: "Chi nhánh" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const BRANCH_IDS: BranchId[] = ["q10", "q3", "pn"];
const LEVELS = ["Begin", "Inter", "Advance"] as const;
const STORY_KINDS: StoryKind[] = ["tiktok", "youtube", "note"];

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

export function AdminApp() {
  const [booted, setBooted] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<TabId>("courses");
  const [draft, setDraft] = useState<SiteData>(seedSiteData);
  const [status, setStatus] = useState("");
  const [loginErr, setLoginErr] = useState("");

  useEffect(() => {
    document.body.classList.add("ma-admin-open");
    setAuthed(isAdminSession());
    setDraft(loadSiteData());
    setBooted(true);
    return () => document.body.classList.remove("ma-admin-open");
  }, []);

  function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (loginAdmin(String(fd.get("user") || ""), String(fd.get("pass") || ""))) {
      setAuthed(true);
      setLoginErr("");
      return;
    }
    setLoginErr("Sai tài khoản hoặc mật khẩu.");
  }

  function onLogout() {
    logoutAdmin();
    setAuthed(false);
  }

  function persist() {
    saveSiteData(draft);
    setStatus("Đã lưu trên máy này.");
    window.setTimeout(() => setStatus(""), 2200);
  }

  function restoreSeed() {
    if (!window.confirm("Xóa overlay local và trở về seed trong code?")) return;
    resetSiteData();
    setDraft(seedSiteData());
    setStatus("Đã reset seed.");
    window.setTimeout(() => setStatus(""), 2200);
  }

  if (!booted) {
    return <p className="ma-admin__boot">Đang tải…</p>;
  }

  if (!authed) {
    return (
      <div className="ma-admin ma-admin--gate">
        <form className="ma-admin-login" onSubmit={onLogin}>
          <p className="label">MA Admin</p>
          <h1>Đăng nhập</h1>
          <p className="ma-admin-login__lead">Tạm — session trên trình duyệt này.</p>
          <label>
            Tài khoản
            <input name="user" type="text" autoComplete="username" required />
          </label>
          <label>
            Mật khẩu
            <input name="pass" type="password" autoComplete="current-password" required />
          </label>
          {loginErr ? <p className="ma-admin-login__err">{loginErr}</p> : null}
          <button type="submit" className="btn btn-primary btn-full">
            Vào
          </button>
          <a className="ma-admin-login__back" href={siteHref("/")}>
            Về site
          </a>
        </form>
      </div>
    );
  }

  return (
    <div className="ma-admin">
      <aside className="ma-admin__side">
        <p className="ma-admin__brand">MA Admin</p>
        <nav className="ma-admin__tabs" aria-label="Admin sections">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={tab === item.id ? "is-active" : ""}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="ma-admin__side-foot">
          <a href={siteHref("/")}>Về site</a>
          <button type="button" onClick={onLogout}>
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="ma-admin__main">
        <header className="ma-admin__bar">
          <h1>{TABS.find((item) => item.id === tab)?.label}</h1>
          <div className="ma-admin__bar-actions">
            {status ? <p className="ma-admin__status">{status}</p> : null}
            <button type="button" className="btn btn-ghost" onClick={restoreSeed}>
              Reset seed
            </button>
            <button type="button" className="btn btn-primary" onClick={persist}>
              Lưu
            </button>
          </div>
        </header>
        <p className="ma-admin__hint">
          Lưu trên máy này (`localStorage`). Trang catalog đọc overlay. Homepage HTML chưa đổi.
        </p>

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
          />
        ) : null}
        {tab === "branches" ? (
          <BranchesEditor
            branches={draft.branches}
            onChange={(branches) => setDraft({ ...draft, branches })}
          />
        ) : null}
      </div>
    </div>
  );
}

function CoursesEditor({
  courses,
  branches,
  onChange,
}: {
  courses: Course[];
  branches: Branch[];
  onChange: (next: Course[]) => void;
}) {
  function patch(i: number, part: Partial<Course>) {
    onChange(courses.map((item, idx) => (idx === i ? { ...item, ...part } : item)));
  }

  return (
    <div className="ma-admin-list">
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() =>
          onChange([
            {
              id: newId("course"),
              style: "K-Pop",
              level: "Begin",
              branch: "q10",
              schedule: "T2 · T5 · 18:00–19:20",
              teacher: "",
              start: "",
              end: "",
              seats: 0,
              cap: 15,
              midOpen: true,
            },
            ...courses,
          ])
        }
      >
        + Thêm khóa
      </button>
      {courses.map((course, i) => (
        <article key={`${course.id}-${i}`} className="ma-admin-card">
          <div className="ma-admin-grid">
            <label>
              ID
              <input value={course.id} onChange={(e) => patch(i, { id: e.target.value })} />
            </label>
            <label>
              Style
              <input value={course.style} onChange={(e) => patch(i, { style: e.target.value })} />
            </label>
            <label>
              Level
              <select
                value={course.level}
                onChange={(e) => patch(i, { level: e.target.value })}
              >
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Chi nhánh
              <select
                value={course.branch}
                onChange={(e) => patch(i, { branch: e.target.value as BranchId })}
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="ma-admin-span">
              Lịch
              <input
                value={course.schedule}
                onChange={(e) => patch(i, { schedule: e.target.value })}
              />
            </label>
            <label>
              GV
              <input
                value={course.teacher}
                onChange={(e) => patch(i, { teacher: e.target.value })}
              />
            </label>
            <label>
              KG
              <input
                type="date"
                value={course.start}
                onChange={(e) => patch(i, { start: e.target.value })}
              />
            </label>
            <label>
              KT
              <input
                type="date"
                value={course.end}
                onChange={(e) => patch(i, { end: e.target.value })}
              />
            </label>
            <label>
              Sĩ số
              <input
                type="number"
                min={0}
                value={course.seats}
                onChange={(e) => patch(i, { seats: Number(e.target.value) })}
              />
            </label>
            <label>
              Cap
              <input
                type="number"
                min={1}
                value={course.cap}
                onChange={(e) => patch(i, { cap: Number(e.target.value) })}
              />
            </label>
            <label className="ma-admin-check">
              <input
                type="checkbox"
                checked={course.midOpen}
                onChange={(e) => patch(i, { midOpen: e.target.checked })}
              />
              Nhận giữa khóa
            </label>
          </div>
          <button
            type="button"
            className="ma-admin-del"
            onClick={() => onChange(courses.filter((_, idx) => idx !== i))}
          >
            Xóa khóa
          </button>
        </article>
      ))}
    </div>
  );
}

function RoomsEditor({
  branches,
  onChange,
}: {
  branches: Branch[];
  onChange: (next: Branch[]) => void;
}) {
  function setRooms(branchId: BranchId, rooms: Room[]) {
    onChange(branches.map((b) => (b.id === branchId ? { ...b, rooms } : b)));
  }

  return (
    <div className="ma-admin-list">
      {branches.map((b) => (
        <section key={b.id} className="ma-admin-card">
          <h2>{b.name}</h2>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() =>
              setRooms(b.id, [
                { id: newId("room"), name: "Phòng mới", size: "vừa", photo: "studio-01.jpg" },
                ...b.rooms,
              ])
            }
          >
            + Thêm phòng
          </button>
          {b.rooms.map((room, i) => (
            <div key={`${room.id}-${i}`} className="ma-admin-grid ma-admin-grid--room">
              <label>
                ID
                <input
                  value={room.id}
                  onChange={(e) =>
                    setRooms(
                      b.id,
                      b.rooms.map((r, idx) => (idx === i ? { ...r, id: e.target.value } : r)),
                    )
                  }
                />
              </label>
              <label>
                Tên
                <input
                  value={room.name}
                  onChange={(e) =>
                    setRooms(
                      b.id,
                      b.rooms.map((r, idx) => (idx === i ? { ...r, name: e.target.value } : r)),
                    )
                  }
                />
              </label>
              <label>
                Size
                <input
                  value={room.size}
                  onChange={(e) =>
                    setRooms(
                      b.id,
                      b.rooms.map((r, idx) => (idx === i ? { ...r, size: e.target.value } : r)),
                    )
                  }
                />
              </label>
              <label>
                Ảnh (file trong /media)
                <input
                  value={room.photo}
                  onChange={(e) =>
                    setRooms(
                      b.id,
                      b.rooms.map((r, idx) => (idx === i ? { ...r, photo: e.target.value } : r)),
                    )
                  }
                />
              </label>
              <button
                type="button"
                className="ma-admin-del"
                onClick={() => setRooms(b.id, b.rooms.filter((_, idx) => idx !== i))}
              >
                Xóa
              </button>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function PackagesEditor({
  packages,
  onChange,
}: {
  packages: Package[];
  onChange: (next: Package[]) => void;
}) {
  function patch(i: number, part: Partial<Package>) {
    onChange(packages.map((item, idx) => (idx === i ? { ...item, ...part } : item)));
  }

  return (
    <div className="ma-admin-list">
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() =>
          onChange([
            {
              id: newId("pkg"),
              tag: "Mới",
              title: "Gói mới",
              sessions: "8 buổi / tháng",
              hold: "Liên hệ bảo lưu",
              deposit: "Không cọc",
              featured: false,
            },
            ...packages,
          ])
        }
      >
        + Thêm gói
      </button>
      {packages.map((pkg, i) => (
        <article key={`${pkg.id}-${i}`} className="ma-admin-card">
          <div className="ma-admin-grid">
            <label>
              ID
              <input value={pkg.id} onChange={(e) => patch(i, { id: e.target.value })} />
            </label>
            <label>
              Tag
              <input value={pkg.tag} onChange={(e) => patch(i, { tag: e.target.value })} />
            </label>
            <label className="ma-admin-span">
              Tiêu đề
              <input value={pkg.title} onChange={(e) => patch(i, { title: e.target.value })} />
            </label>
            <label className="ma-admin-span">
              Buổi
              <input
                value={pkg.sessions}
                onChange={(e) => patch(i, { sessions: e.target.value })}
              />
            </label>
            <label className="ma-admin-span">
              Bảo lưu
              <input value={pkg.hold} onChange={(e) => patch(i, { hold: e.target.value })} />
            </label>
            <label className="ma-admin-span">
              Cọc
              <input value={pkg.deposit} onChange={(e) => patch(i, { deposit: e.target.value })} />
            </label>
            <label className="ma-admin-check">
              <input
                type="checkbox"
                checked={pkg.featured}
                onChange={(e) => patch(i, { featured: e.target.checked })}
              />
              Nổi bật
            </label>
          </div>
          <button
            type="button"
            className="ma-admin-del"
            onClick={() => onChange(packages.filter((_, idx) => idx !== i))}
          >
            Xóa gói
          </button>
        </article>
      ))}
    </div>
  );
}

function StoriesEditor({
  stories,
  onChange,
}: {
  stories: Story[];
  onChange: (next: Story[]) => void;
}) {
  function patch(i: number, part: Partial<Story>) {
    onChange(stories.map((item, idx) => (idx === i ? { ...item, ...part } : item)));
  }

  return (
    <div className="ma-admin-list">
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() =>
          onChange([
            {
              slug: newId("story"),
              date: new Date().toISOString().slice(0, 10),
              kind: "note",
              kindLabel: "Case",
              image: "studio-01.jpg",
              imageAlt: "",
              title: "Story mới",
              excerpt: "",
              body: [""],
            },
            ...stories,
          ])
        }
      >
        + Thêm story
      </button>
      {stories.map((story, i) => (
        <article key={`${story.slug}-${i}`} className="ma-admin-card">
          <div className="ma-admin-grid">
            <label>
              Slug
              <input value={story.slug} onChange={(e) => patch(i, { slug: e.target.value })} />
            </label>
            <label>
              Ngày
              <input
                type="date"
                value={story.date}
                onChange={(e) => patch(i, { date: e.target.value })}
              />
            </label>
            <label>
              Kind
              <select
                value={story.kind}
                onChange={(e) => patch(i, { kind: e.target.value as StoryKind })}
              >
                {STORY_KINDS.map((kind) => (
                  <option key={kind} value={kind}>
                    {kind}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Nhãn
              <input
                value={story.kindLabel}
                onChange={(e) => patch(i, { kindLabel: e.target.value })}
              />
            </label>
            <label className="ma-admin-span">
              Tiêu đề
              <input value={story.title} onChange={(e) => patch(i, { title: e.target.value })} />
            </label>
            <label>
              Ảnh
              <input value={story.image} onChange={(e) => patch(i, { image: e.target.value })} />
            </label>
            <label className="ma-admin-span">
              Alt
              <input
                value={story.imageAlt}
                onChange={(e) => patch(i, { imageAlt: e.target.value })}
              />
            </label>
            <label className="ma-admin-span">
              Excerpt
              <textarea
                rows={2}
                value={story.excerpt}
                onChange={(e) => patch(i, { excerpt: e.target.value })}
              />
            </label>
            <label className="ma-admin-span">
              Body (mỗi dòng 1 đoạn)
              <textarea
                rows={5}
                value={story.body.join("\n")}
                onChange={(e) =>
                  patch(i, { body: e.target.value.split("\n").filter((line) => line.length > 0) })
                }
              />
            </label>
            <label className="ma-admin-span">
              Watch label
              <input
                value={story.watchLabel || ""}
                onChange={(e) => patch(i, { watchLabel: e.target.value || undefined })}
              />
            </label>
            <label className="ma-admin-span">
              Watch URL
              <input
                value={story.watchHref || ""}
                onChange={(e) => patch(i, { watchHref: e.target.value || undefined })}
              />
            </label>
          </div>
          <button
            type="button"
            className="ma-admin-del"
            onClick={() => onChange(stories.filter((_, idx) => idx !== i))}
          >
            Xóa story
          </button>
        </article>
      ))}
    </div>
  );
}

function BranchesEditor({
  branches,
  onChange,
}: {
  branches: Branch[];
  onChange: (next: Branch[]) => void;
}) {
  function patch(id: BranchId, part: Partial<Branch>) {
    onChange(branches.map((b) => (b.id === id ? { ...b, ...part } : b)));
  }

  return (
    <div className="ma-admin-list">
      {BRANCH_IDS.map((id) => {
        const b = branches.find((item) => item.id === id);
        if (!b) return null;
        return (
          <article key={id} className="ma-admin-card">
            <h2>{id.toUpperCase()}</h2>
            <div className="ma-admin-grid">
              <label className="ma-admin-span">
                Tên
                <input value={b.name} onChange={(e) => patch(id, { name: e.target.value })} />
              </label>
              <label className="ma-admin-span">
                Địa chỉ
                <input
                  value={b.address}
                  onChange={(e) => patch(id, { address: e.target.value })}
                />
              </label>
              <label className="ma-admin-span">
                Ghi chú
                <input value={b.note} onChange={(e) => patch(id, { note: e.target.value })} />
              </label>
            </div>
          </article>
        );
      })}
    </div>
  );
}
