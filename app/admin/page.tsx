import type { Metadata } from "next";
import { AdminApp } from "@/components/AdminApp";

export const metadata: Metadata = {
  title: "Admin — MA Dance Studio",
  description: "Admin catalog MA Dance — GET/ghi Worker ma-website.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
