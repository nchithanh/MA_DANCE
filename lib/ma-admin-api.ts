import type { Branch, Course, Package, Room } from "@/lib/discovery-data";
import type { Homepage } from "@/lib/homepage-data";
import { MA_API_URL } from "@/lib/ma-api";
import type { SeoDoc } from "@/lib/seo-data";
import type { SiteData } from "@/lib/site-data";
import type { Story } from "@/lib/stories";

type FlatRoom = Room & { branch: string };

async function adminFetch(
  token: string,
  method: string,
  path: string,
  body?: unknown,
) {
  const res = await fetch(`${MA_API_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body == null ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as { error?: string } | null;
  if (!res.ok) {
    throw new Error(data?.error || `admin_${res.status}`);
  }
  return data;
}

export async function loginAdminApi(user: string, pass: string): Promise<string> {
  const res = await fetch(`${MA_API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, pass }),
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as
    | { token?: string; error?: string }
    | null;
  if (!res.ok || !data?.token) {
    throw new Error(data?.error || `login_${res.status}`);
  }
  return data.token;
}

export async function verifyAdminSession(token: string) {
  await adminFetch(token, "GET", "/api/session");
}

export async function logoutAdminApi(token: string) {
  await adminFetch(token, "POST", "/api/logout");
}

export async function putHomepage(token: string, homepage: Homepage) {
  await adminFetch(token, "PUT", "/api/homepage", homepage);
}

export async function putSeo(token: string, seo: SeoDoc) {
  await adminFetch(token, "PUT", "/api/seo", seo);
}

export async function uploadMedia(token: string, file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch(`${MA_API_URL}/api/media`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body,
    cache: "no-store",
  });
  const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
  if (!res.ok || !data?.url) {
    throw new Error(data?.error || `upload_${res.status}`);
  }
  return data.url;
}

function byId<T>(items: T[], key: (item: T) => string): Map<string, T> {
  return new Map(items.map((item) => [key(item), item]));
}

function diffKeys(prev: string[], next: string[]) {
  const prevSet = new Set(prev);
  const nextSet = new Set(next);
  return {
    added: next.filter((id) => !prevSet.has(id)),
    removed: prev.filter((id) => !nextSet.has(id)),
    kept: next.filter((id) => prevSet.has(id)),
  };
}

function flatRooms(branches: Branch[]): FlatRoom[] {
  return branches.flatMap((branch) =>
    branch.rooms.map((room) => ({ ...room, branch: branch.id })),
  );
}

function courseBody(course: Course, sort_order: number) {
  return {
    id: course.id,
    style: course.style,
    level: course.level,
    branch: course.branch,
    schedule: course.schedule,
    teacher: course.teacher,
    start: course.start,
    end: course.end,
    seats: course.seats,
    cap: course.cap,
    midOpen: course.midOpen,
    sort_order,
  };
}

function packageBody(pkg: Package, sort_order: number) {
  return {
    id: pkg.id,
    tag: pkg.tag,
    title: pkg.title,
    sessions: pkg.sessions,
    hold: pkg.hold,
    deposit: pkg.deposit,
    featured: pkg.featured,
    sort_order,
  };
}

function storyBody(story: Story, sort_order: number) {
  return {
    slug: story.slug,
    date: story.date,
    kind: story.kind,
    kindLabel: story.kindLabel,
    image: story.image,
    imageAlt: story.imageAlt,
    title: story.title,
    excerpt: story.excerpt,
    body: story.body,
    watchLabel: story.watchLabel || null,
    watchHref: story.watchHref || null,
    sort_order,
  };
}

function roomBody(room: FlatRoom, sort_order: number) {
  return {
    id: room.id,
    branch: room.branch,
    name: room.name,
    size: room.size,
    photo: room.photo,
    sort_order,
  };
}

function branchBody(branch: Branch, sort_order: number) {
  return {
    id: branch.id,
    name: branch.name,
    address: branch.address,
    note: branch.note,
    sort_order,
  };
}

export async function syncCatalog(token: string, snapshot: SiteData, draft: SiteData) {
  const prevRooms = flatRooms(snapshot.branches);
  const nextRooms = flatRooms(draft.branches);

  const courses = diffKeys(
    snapshot.courses.map((item) => item.id),
    draft.courses.map((item) => item.id),
  );
  const rooms = diffKeys(
    prevRooms.map((item) => item.id),
    nextRooms.map((item) => item.id),
  );
  const packages = diffKeys(
    snapshot.packages.map((item) => item.id),
    draft.packages.map((item) => item.id),
  );
  const stories = diffKeys(
    snapshot.stories.map((item) => item.slug),
    draft.stories.map((item) => item.slug),
  );
  const branches = diffKeys(
    snapshot.branches.map((item) => item.id),
    draft.branches.map((item) => item.id),
  );

  const nextCourse = byId(draft.courses, (item) => item.id);
  const nextRoom = byId(nextRooms, (item) => item.id);
  const nextPkg = byId(draft.packages, (item) => item.id);
  const nextStory = byId(draft.stories, (item) => item.slug);
  const nextBranch = byId(draft.branches, (item) => item.id);

  const courseOrder = new Map<string, number>(draft.courses.map((item, i) => [item.id, i]));
  const roomOrder = new Map<string, number>(nextRooms.map((item, i) => [item.id, i]));
  const pkgOrder = new Map<string, number>(draft.packages.map((item, i) => [item.id, i]));
  const storyOrder = new Map<string, number>(draft.stories.map((item, i) => [item.slug, i]));
  const branchOrder = new Map<string, number>(draft.branches.map((item, i) => [item.id, i]));

  for (const id of courses.removed) {
    await adminFetch(token, "DELETE", `/api/courses/${encodeURIComponent(id)}`);
  }
  for (const id of rooms.removed) {
    await adminFetch(token, "DELETE", `/api/rooms/${encodeURIComponent(id)}`);
  }
  for (const slug of stories.removed) {
    await adminFetch(token, "DELETE", `/api/stories/${encodeURIComponent(slug)}`);
  }
  for (const id of packages.removed) {
    await adminFetch(token, "DELETE", `/api/packages/${encodeURIComponent(id)}`);
  }
  for (const id of branches.removed) {
    await adminFetch(token, "DELETE", `/api/branches/${encodeURIComponent(id)}`);
  }

  for (const id of branches.added) {
    const row = nextBranch.get(id);
    if (row) await adminFetch(token, "POST", "/api/branches", branchBody(row, branchOrder.get(id) ?? 0));
  }
  for (const id of branches.kept) {
    const row = nextBranch.get(id);
    if (row) {
      await adminFetch(
        token,
        "PUT",
        `/api/branches/${encodeURIComponent(id)}`,
        branchBody(row, branchOrder.get(id) ?? 0),
      );
    }
  }

  for (const id of rooms.added) {
    const row = nextRoom.get(id);
    if (row) await adminFetch(token, "POST", "/api/rooms", roomBody(row, roomOrder.get(id) ?? 0));
  }
  for (const id of rooms.kept) {
    const row = nextRoom.get(id);
    if (row) {
      await adminFetch(
        token,
        "PUT",
        `/api/rooms/${encodeURIComponent(id)}`,
        roomBody(row, roomOrder.get(id) ?? 0),
      );
    }
  }

  for (const id of courses.added) {
    const row = nextCourse.get(id);
    if (row) await adminFetch(token, "POST", "/api/courses", courseBody(row, courseOrder.get(id) ?? 0));
  }
  for (const id of courses.kept) {
    const row = nextCourse.get(id);
    if (row) {
      await adminFetch(
        token,
        "PUT",
        `/api/courses/${encodeURIComponent(id)}`,
        courseBody(row, courseOrder.get(id) ?? 0),
      );
    }
  }

  for (const id of packages.added) {
    const row = nextPkg.get(id);
    if (row) await adminFetch(token, "POST", "/api/packages", packageBody(row, pkgOrder.get(id) ?? 0));
  }
  for (const id of packages.kept) {
    const row = nextPkg.get(id);
    if (row) {
      await adminFetch(
        token,
        "PUT",
        `/api/packages/${encodeURIComponent(id)}`,
        packageBody(row, pkgOrder.get(id) ?? 0),
      );
    }
  }

  for (const slug of stories.added) {
    const row = nextStory.get(slug);
    if (row) await adminFetch(token, "POST", "/api/stories", storyBody(row, storyOrder.get(slug) ?? 0));
  }
  for (const slug of stories.kept) {
    const row = nextStory.get(slug);
    if (row) {
      await adminFetch(
        token,
        "PUT",
        `/api/stories/${encodeURIComponent(slug)}`,
        storyBody(row, storyOrder.get(slug) ?? 0),
      );
    }
  }
}
