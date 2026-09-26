import type { Metadata } from "next";
import { AdminApp } from "@/components/AdminApp";

export const metadata: Metadata = {
  title: "Admin — MA Dance Studio",
  description: "Quản lý catalog MA Dance trên máy này.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
