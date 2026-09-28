"use client";

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
      className="modal show d-block"
      role="dialog"
      aria-modal="true"
      aria-busy={busy}
      aria-labelledby="ma-admin-overlay-title"
      style={{ background: "rgba(0,0,0,.55)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body text-center d-grid gap-3 justify-items-center py-4">
            {busy ? <div className="spinner-border" role="status" aria-hidden="true" /> : null}
            {state.mode === "ok" ? (
              <p className="badge text-bg-success fs-6 mb-0" aria-hidden="true">
                ✓
              </p>
            ) : null}
            <h2 id="ma-admin-overlay-title" className="h5 mb-0">
              {state.title}
            </h2>
            {state.detail ? <p className="text-secondary small mb-0">{state.detail}</p> : null}
            {state.mode === "err" ? (
              <button type="button" className="btn btn-primary" onClick={onDismiss}>
                Đóng
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
