import type { Branch, BranchId, Course, Package } from "@/lib/discovery-data";
import { parseHomepage, type Homepage } from "@/lib/homepage-data";
import type { Story, StoryKind } from "@/lib/stories";

export const MA_API_URL = (
  process.env.NEXT_PUBLIC_MA_API_URL ||
  "https://ma-website.nchithanh9999.workers.dev"
).replace(/\/$/, "");

export type MidEnroll = { level: string; rule: string };

export type Catalog = {
  version: number;
  branches: Branch[];
  courses: Course[];
  packages: Package[];
  stories: Story[];
  midEnroll: MidEnroll[];
};

const BRANCH_IDS = new Set<BranchId>(["q10", "q3", "pn"]);
const STORY_KINDS = new Set<StoryKind>(["tiktok", "youtube", "note"]);

function asBranchId(value: unknown): BranchId {
  const id = String(value ?? "");
  if (BRANCH_IDS.has(id as BranchId)) return id as BranchId;
  throw new Error("catalog_invalid");
}

function asStoryKind(value: unknown): StoryKind {
  const kind = String(value ?? "");
  if (STORY_KINDS.has(kind as StoryKind)) return kind as StoryKind;
  throw new Error("catalog_invalid");
}

function str(value: unknown) {
  return value == null ? "" : String(value);
}

function num(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function mapRoom(raw: Record<string, unknown>) {
  return {
    id: str(raw.id),
    name: str(raw.name),
    size: str(raw.size),
    photo: str(raw.photo),
  };
}

function mapBranch(raw: Record<string, unknown>): Branch {
  const rooms = Array.isArray(raw.rooms)
    ? raw.rooms.map((room) => mapRoom(room as Record<string, unknown>))
    : [];
  return {
    id: asBranchId(raw.id),
    name: str(raw.name),
    address: str(raw.address),
    note: str(raw.note),
    rooms,
  };
}

function mapCourse(raw: Record<string, unknown>): Course {
  return {
    id: str(raw.id),
    style: str(raw.style),
    level: str(raw.level),
    branch: asBranchId(raw.branch),
    schedule: str(raw.schedule),
    teacher: str(raw.teacher),
    start: str(raw.start),
    end: str(raw.end),
    seats: num(raw.seats),
    cap: num(raw.cap, 15),
    midOpen: Boolean(raw.midOpen),
  };
}

function mapPackage(raw: Record<string, unknown>): Package {
  return {
    id: str(raw.id),
    tag: str(raw.tag),
    title: str(raw.title),
    sessions: str(raw.sessions),
    hold: str(raw.hold),
    deposit: str(raw.deposit),
    featured: Boolean(raw.featured),
  };
}

function mapStory(raw: Record<string, unknown>): Story {
  const body = Array.isArray(raw.body)
    ? raw.body.map((line) => str(line)).filter((line) => line.length > 0)
    : [];
  const watchLabel = str(raw.watchLabel);
  const watchHref = str(raw.watchHref);
  return {
    slug: str(raw.slug),
    date: str(raw.date),
    kind: asStoryKind(raw.kind),
    kindLabel: str(raw.kindLabel),
    image: str(raw.image),
    imageAlt: str(raw.imageAlt),
    title: str(raw.title),
    excerpt: str(raw.excerpt),
    body,
    watchLabel: watchLabel || undefined,
    watchHref: watchHref || undefined,
  };
}

export async function fetchCatalog(): Promise<Catalog> {
  const res = await fetch(`${MA_API_URL}/api/catalog`, { cache: "no-store" });
  if (!res.ok) throw new Error(`catalog_${res.status}`);
  const raw = (await res.json()) as Record<string, unknown>;
  if (
    !raw ||
    !Array.isArray(raw.branches) ||
    !Array.isArray(raw.courses) ||
    !Array.isArray(raw.packages) ||
    !Array.isArray(raw.stories) ||
    !Array.isArray(raw.midEnroll)
  ) {
    throw new Error("catalog_invalid");
  }
  return {
    version: num(raw.version, 1),
    branches: raw.branches.map((row) => mapBranch(row as Record<string, unknown>)),
    courses: raw.courses.map((row) => mapCourse(row as Record<string, unknown>)),
    packages: raw.packages.map((row) => mapPackage(row as Record<string, unknown>)),
    stories: raw.stories.map((row) => mapStory(row as Record<string, unknown>)),
    midEnroll: raw.midEnroll.map((row) => {
      const item = row as Record<string, unknown>;
      return { level: str(item.level), rule: str(item.rule) };
    }),
  };
}

export async function fetchHomepage(): Promise<Homepage> {
  const res = await fetch(`${MA_API_URL}/api/homepage`, { cache: "no-store" });
  if (!res.ok) throw new Error(`homepage_${res.status}`);
  return parseHomepage(await res.json());
}
