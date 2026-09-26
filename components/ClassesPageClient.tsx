"use client";

import { useMemo, useState } from "react";
import { BookingCta } from "@/components/BookingCta";
import { branchName, branches, courses, midEnroll } from "@/lib/discovery-data";

export function ClassesPageClient() {
  const [branch, setBranch] = useState("");
  const [level, setLevel] = useState("");
  const [style, setStyle] = useState("");
  const styles = useMemo(
    () => [...new Set(courses.map((c) => c.style))].sort(),
    [],
  );
  const list = courses.filter(
    (c) =>
      (!branch || c.branch === branch) &&
      (!level || c.level === level) &&
      (!style || c.style === style),
  );

  return (
    <>
      <form className="ma-filters" onSubmit={(e) => e.preventDefault()}>
        <label>
          Chi nhánh
          <select value={branch} onChange={(e) => setBranch(e.target.value)}>
            <option value="">Tất cả</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Level
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">Tất cả</option>
            <option value="Begin">Begin</option>
            <option value="Inter">Inter</option>
            <option value="Advance">Advance</option>
          </select>
        </label>
        <label>
          Style
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="">Tất cả</option>
            {styles.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </form>

      <aside className="ma-callout">
        <h2>Nhận giữa khóa</h2>
        <ul>
          {midEnroll.map((m) => (
            <li key={m.level}>
              <strong>{m.level}</strong> — {m.rule}
            </li>
          ))}
        </ul>
      </aside>

      <div className="ma-course-grid">
        {list.map((c) => {
          const full = c.seats >= c.cap;
          return (
            <article key={c.id} className="ma-course-card">
              <div className="ma-chips">
                <span>{c.style}</span>
                <span>{c.level}</span>
                <span>{branchName(c.branch)}</span>
                {full ? <span className="is-full">Full</span> : null}
                {c.midOpen && !full ? <span className="is-mid">Nhận giữa khóa</span> : null}
              </div>
              <h2>
                {c.style} · {c.level}
              </h2>
              <p>
                {c.schedule} · GV {c.teacher}
              </p>
              <p>
                KG {c.start} → KT {c.end} · 8 buổi/tháng
              </p>
              <div className="ma-course-foot">
                <span>
                  {c.seats}/{c.cap} HV
                </span>
                <BookingCta className="btn btn-primary btn-sm">
                  {full ? "Hỏi khung khác" : "Đăng ký"}
                </BookingCta>
              </div>
            </article>
          );
        })}
      </div>
      {list.length === 0 ? (
        <p className="ma-empty">Không có khóa khớp bộ lọc. Thử CN / level khác hoặc nhắn Zalo.</p>
      ) : null}
    </>
  );
}
