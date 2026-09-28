"use client";

import type { ChangeEvent } from "react";
import { getAdminToken } from "@/lib/admin-auth";
import { uploadMedia } from "@/lib/ma-admin-api";
import { previewUrl } from "@/lib/media";
import type { AdminOverlayState } from "@/components/AdminOverlay";
import { Input } from "@/components/admin/ui";

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
    <label className="grid content-start gap-2">
      <span className="text-xs font-medium tracking-wide text-ma-text-secondary">{label}</span>
      {preview ? (
        <img src={preview} alt="" className="aspect-[4/3] w-full max-w-48 rounded-2xl border border-ma-border object-cover" />
      ) : (
        <span className="grid aspect-[4/3] w-full max-w-48 place-items-center rounded-2xl border border-dashed border-ma-border text-xs text-ma-text-muted">
          Chưa có ảnh
        </span>
      )}
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={(e) => void onFile(e)}
        className="text-base text-ma-text-secondary file:mr-3 file:rounded-xl file:border-0 file:bg-ma-accent file:px-3 file:py-1.5 file:text-base file:font-medium file:text-black md:text-xs md:file:text-xs"
      />
    </label>
  );
}
