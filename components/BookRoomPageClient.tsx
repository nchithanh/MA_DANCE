"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { branches } from "@/lib/discovery-data";

export function BookRoomPageClient() {
  const params = useSearchParams();
  const [branchId, setBranchId] = useState(params.get("branch") || "q10");
  const [roomId, setRoomId] = useState(params.get("room") || "");
  const [sent, setSent] = useState(false);
  const branch = branches.find((b) => b.id === branchId);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
    window.setTimeout(() => setSent(false), 2500);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      <form className="ma-lead-form" onSubmit={onSubmit}>
        <fieldset>
          <legend>Slot</legend>
          <label>
            Chi nhánh
            <select
              required
              value={branchId}
              onChange={(e) => {
                setBranchId(e.target.value);
                setRoomId("");
              }}
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Phòng
            <select
              required
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            >
              <option value="">Chọn phòng</option>
              {(branch?.rooms || []).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} · {r.size}
                </option>
              ))}
            </select>
          </label>
          <div className="ma-row ma-row--3">
            <label>
              Ngày
              <input type="date" name="date" required />
            </label>
            <label>
              Giờ bắt đầu
              <input type="time" name="start" required />
            </label>
            <label>
              Số giờ
              <input type="number" name="hours" min={1} max={8} step={0.5} defaultValue={1} required />
            </label>
          </div>
          <label>
            Số người (ước tính)
            <input type="number" name="people" min={1} max={20} defaultValue={6} required />
          </label>
          <label>
            Mục đích
            <select name="purpose" required defaultValue="practice">
              <option value="practice">Luyện tập team</option>
              <option value="cover">Cover / quay video</option>
              <option value="private">Tập cá nhân</option>
              <option value="other">Khác</option>
            </select>
          </label>
        </fieldset>
        <fieldset>
          <legend>Liên hệ</legend>
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
            Ghi chú
            <textarea name="message" rows={3} />
          </label>
        </fieldset>
        <button type="submit" className="btn btn-primary btn-full">
          {sent ? "Đã gửi!" : "Gửi đặt phòng"}
        </button>
        {sent ? (
          <p className="ma-success">Đã nhận. Team sẽ xác nhận slot / báo giá qua Zalo.</p>
        ) : null}
      </form>
    </>
  );
}
