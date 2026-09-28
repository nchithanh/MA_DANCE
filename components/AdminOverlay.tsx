"use client";

import { Button } from "@/components/admin/ui";

export type AdminOverlayState =
  | { mode: "busy"; title: string; detail?: string }
  | { mode: "ok"; title: string; detail?: string }
  | { mode: "err"; title: string; detail?: string };

export function AdminOverlay({
  state,
  onDismiss,
}: {
  state: AdminOverlayState | null;
  onDismiss?: () => void;
}) {
  if (!state) return null;
  const busy = state.mode === "busy";
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-busy={busy}
      aria-labelledby="ma-admin-overlay-title"
    >
      <div className="w-full max-w-sm rounded-2xl border border-ma-border bg-ma-card px-6 py-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
        {busy ? (
          <span
            className="mx-auto mb-4 block size-8 animate-spin rounded-full border-2 border-ma-border border-t-ma-accent"
            role="status"
            aria-hidden
          />
        ) : null}
        {state.mode === "ok" ? (
          <p className="mx-auto mb-3 grid size-9 place-items-center rounded-full bg-ma-success/15 text-sm text-ma-success" aria-hidden>
            ✓
          </p>
        ) : null}
        <h2 id="ma-admin-overlay-title" className="text-base font-medium text-ma-text">
          {state.title}
        </h2>
        {state.detail ? <p className="mt-2 text-sm text-ma-text-secondary">{state.detail}</p> : null}
        {state.mode === "err" ? (
          <Button className="mt-5" onClick={onDismiss}>
            Đóng
          </Button>
        ) : null}
      </div>
    </div>
  );
}
