"use client";

import type { ChangeEvent } from "react";
import { getAdminToken } from "@/lib/admin-auth";
import { uploadMedia } from "@/lib/ma-admin-api";
import { previewUrl } from "@/lib/media";
import type { AdminOverlayState } from "@/components/AdminOverlay";

export function ImageField({
  label,
  value,
  onChange,
  onBusy,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  onBusy?: (state: AdminOverlayState | null) => void;
}) {
  const preview = previewUrl(value);

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const token = getAdminToken();
    if (!token) {
      onBusy?.({ mode: "err", title: "Hết phiên", detail: "Đăng nhập lại để upload." });
      return;
    }
    onBusy?.({ mode: "busy", title: "Đang tải ảnh…", detail: file.name });
    try {
      onChange(await uploadMedia(token, file));
      onBusy?.(null);
    } catch (err) {
      const detail = err instanceof Error ? err.message : "upload_failed";
      onBusy?.({ mode: "err", title: "Không upload được", detail });
    }
  }

  return (
    <label className="col-12 col-md-6 d-grid align-content-start">
      <span className="form-label">{label}</span>
      {preview ? (
        <img className="admin-thumb img-thumbnail" src={preview} alt="" />
      ) : (
        <span className="admin-thumb-empty d-grid border rounded text-secondary small">Chưa có ảnh</span>
      )}
      <input className="form-control mt-2" value={value} onChange={(e) => onChange(e.target.value)} />
      <input
        className="form-control mt-2"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={(e) => void onFile(e)}
      />
    </label>
  );
}
