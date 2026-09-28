export function CatalogStatus({
  ready,
  error,
}: {
  ready: boolean;
  error: string | null;
}) {
  if (!ready) {
    return <p className="ma-empty">Đang tải catalog…</p>;
  }
  if (error) {
    return (
      <p className="ma-empty">Không tải được catalog từ Worker. Thử lại sau.</p>
    );
  }
  return null;
}
