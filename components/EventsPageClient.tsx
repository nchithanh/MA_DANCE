"use client";

import { FormEvent, useState } from "react";

export function EventsPageClient() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
    window.setTimeout(() => setSent(false), 2500);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      <div className="ma-svc-grid">
        <article>
          <span>01</span>
          <h2>Choreography cá nhân / team</h2>
          <p>Cover, stage, thi đấu — chỉnh theo level nhóm.</p>
        </article>
        <article>
          <span>02</span>
          <h2>Brand & corporate</h2>
          <p>Tiết mục sự kiện công ty, launch, showcase.</p>
        </article>
        <article>
          <span>03</span>
          <h2>MV / content</h2>
          <p>Biên đạo + dancer cho quay clip / social.</p>
        </article>
      </div>

      <form className="ma-lead-form" onSubmit={onSubmit}>
        <h2 className="ma-form-title">Gửi brief</h2>
        <div className="ma-row">
          <label>
            Họ tên
            <input name="name" required />
          </label>
          <label>
            Zalo / SĐT
            <input name="phone" type="tel" required />
          </label>
        </div>
        <label>
          Loại nhu cầu
          <select name="type" required defaultValue="personal">
            <option value="personal">Cá nhân / team</option>
            <option value="brand">Brand / corporate</option>
            <option value="mv">MV / content</option>
            <option value="other">Khác</option>
          </select>
        </label>
        <div className="ma-row">
          <label>
            Ngày dự kiến
            <input type="date" name="date" />
          </label>
          <label>
            Địa điểm
            <input name="place" placeholder="Studio MA / ngoài" />
          </label>
        </div>
        <label>
          Mô tả brief
          <textarea name="brief" rows={5} required placeholder="Style, số dancer, deadline…" />
        </label>
        <button type="submit" className="btn btn-primary btn-full">
          {sent ? "Đã gửi!" : "Gửi brief"}
        </button>
        {sent ? <p className="ma-success">Đã nhận brief. MA sẽ liên hệ tư vấn.</p> : null}
      </form>
    </>
  );
}
