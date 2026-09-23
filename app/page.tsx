import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MaDanceHome } from "@/components/MaDanceHome";

export default function HomePage() {
  const html = readFileSync(
    join(process.cwd(), "content", "body.html"),
    "utf8",
  );
  return <MaDanceHome html={html} />;
}
