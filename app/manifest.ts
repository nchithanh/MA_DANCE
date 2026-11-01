import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MA Dance Studio",
    short_name: "MA Dance",
    description:
      "MA Dance Studio — đăng ký khóa 8 buổi/tháng, thuê phòng 3 chi nhánh, biên đạo sự kiện.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#050505",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
