"use client";

import type { ReactNode } from "react";
import type { AdminOverlayState } from "@/components/AdminOverlay";
import { Badge, Button, Checkbox, CollapseCard, Field, FieldGrid, Input, Select, Textarea } from "@/components/admin/ui";
import { ImageField } from "@/components/ImageField";
import type { Branch, BranchId, Course, Package, Room } from "@/lib/discovery-data";
import { previewUrl } from "@/lib/media";
import type { Story, StoryKind } from "@/lib/stories";

const BRANCH_IDS: BranchId[] = ["q10", "q3", "pn"];
const LEVELS = ["Begin", "Inter", "Advance"] as const;
const STORY_KINDS: StoryKind[] = ["tiktok", "youtube", "note"];

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`;
}

function Toolbar({
  count,
  unit,
  onAdd,
  addLabel,
}: {
  count: number;
  unit: string;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-ma-text-secondary">
        {count} {unit}
      </p>
      <Button variant="secondary" size="sm" onClick={onAdd}>
        {addLabel}
      </Button>
    </div>
  );
}

function ItemAcc({
  title,
  chips,
  thumb,
  children,
}: {
  title: string;
  chips?: string[];
  thumb?: string;
  children: ReactNode;
}) {
  const src = thumb ? previewUrl(thumb) : "";
  return (
    <CollapseCard
      title={title}
      thumb={src || undefined}
      badge={
        <span className="hidden flex-wrap gap-1 sm:flex">
          {(chips || []).filter(Boolean).map((chip) => (
            <Badge key={chip}>{chip}</Badge>
          ))}
        </span>
      }
    >
      {children}
    </CollapseCard>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  wide,
  min,
}: {
  label: string;
  value: string | number;
  onChange: (next: string) => void;
  type?: string;
  wide?: boolean;
  min?: number;
}) {
  return (
    <Field label={label} wide={wide}>
      <Input type={type} min={min} value={value} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  children: ReactNode;
}) {
  return (
    <Field label={label}>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </Select>
    </Field>
  );
}

export function CoursesEditor({
  courses,
  branches,
  onChange,
}: {
  courses: Course[];
  branches: Branch[];
  onChange: (next: Course[]) => void;
}) {
  function patch(i: number, part: Partial<Course>) {
    onChange(courses.map((item, idx) => (idx === i ? { ...item, ...part } : item)));
  }

  return (
    <div className="grid gap-4">
      <Toolbar
        count={courses.length}
        unit="khóa"
        addLabel="+ Thêm khóa"
        onAdd={() =>
          onChange([
            {
              id: newId("course"),
              style: "K-Pop",
              level: "Begin",
              branch: "q10",
              schedule: "T2 · T5 · 18:00–19:20",
              teacher: "",
              start: "",
              end: "",
              seats: 0,
              cap: 15,
              midOpen: true,
            },
            ...courses,
          ])
        }
      />
      {courses.map((course, i) => {
        const branchName = branches.find((b) => b.id === course.branch)?.name || course.branch;
        return (
          <ItemAcc
            key={`${course.id}-${i}`}
            title={course.style}
            chips={[course.level, branchName, course.midOpen ? "Giữa khóa" : ""]}
          >
            <FieldGrid>
              <TextField label="ID" value={course.id} onChange={(id) => patch(i, { id })} />
              <TextField label="Style" value={course.style} onChange={(style) => patch(i, { style })} />
              <SelectField label="Level" value={course.level} onChange={(level) => patch(i, { level })}>
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </SelectField>
              <SelectField label="Chi nhánh" value={course.branch} onChange={(branch) => patch(i, { branch: branch as BranchId })}>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </SelectField>
              <TextField wide label="Lịch" value={course.schedule} onChange={(schedule) => patch(i, { schedule })} />
              <TextField label="GV" value={course.teacher} onChange={(teacher) => patch(i, { teacher })} />
              <TextField label="KG" type="date" value={course.start} onChange={(start) => patch(i, { start })} />
              <TextField label="KT" type="date" value={course.end} onChange={(end) => patch(i, { end })} />
              <TextField label="Sĩ số" type="number" min={0} value={course.seats} onChange={(seats) => patch(i, { seats: Number(seats) })} />
              <TextField label="Cap" type="number" min={1} value={course.cap} onChange={(cap) => patch(i, { cap: Number(cap) })} />
              <Checkbox
                id={`mid-${course.id}-${i}`}
                label="Nhận giữa khóa"
                checked={course.midOpen}
                onChange={(midOpen) => patch(i, { midOpen })}
              />
            </FieldGrid>
            <Button variant="danger" size="sm" className="w-fit" onClick={() => onChange(courses.filter((_, idx) => idx !== i))}>
              Xóa khóa
            </Button>
          </ItemAcc>
        );
      })}
    </div>
  );
}

export function RoomsEditor({
  branches,
  onChange,
  onBusy,
}: {
  branches: Branch[];
  onChange: (next: Branch[]) => void;
  onBusy?: (state: AdminOverlayState | null) => void;
}) {
  function setRooms(branchId: BranchId, rooms: Room[]) {
    onChange(branches.map((b) => (b.id === branchId ? { ...b, rooms } : b)));
  }

  return (
    <div className="grid gap-4">
      {branches.map((b) => (
        <section key={b.id} className="grid gap-4 rounded-2xl border border-ma-border bg-ma-card p-4 shadow-[0_16px_40px_rgba(0,0,0,0.28)] sm:p-5">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-ma-text-muted">{b.id.toUpperCase()}</p>
              <h2 className="text-base font-medium">{b.name}</h2>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setRooms(b.id, [{ id: newId("room"), name: "Phòng mới", size: "vừa", photo: "studio-01.jpg" }, ...b.rooms])
              }
            >
              + Thêm phòng
            </Button>
          </header>
          {b.rooms.map((room, i) => (
            <ItemAcc key={`${room.id}-${i}`} title={room.name} chips={[room.size]} thumb={room.photo}>
              <FieldGrid>
                <TextField
                  label="ID"
                  value={room.id}
                  onChange={(id) => setRooms(b.id, b.rooms.map((r, idx) => (idx === i ? { ...r, id } : r)))}
                />
                <TextField
                  label="Tên"
                  value={room.name}
                  onChange={(name) => setRooms(b.id, b.rooms.map((r, idx) => (idx === i ? { ...r, name } : r)))}
                />
                <TextField
                  label="Size"
                  value={room.size}
                  onChange={(size) => setRooms(b.id, b.rooms.map((r, idx) => (idx === i ? { ...r, size } : r)))}
                />
                <ImageField
                  label="Ảnh"
                  value={room.photo}
                  onBusy={onBusy}
                  onChange={(photo) => setRooms(b.id, b.rooms.map((r, idx) => (idx === i ? { ...r, photo } : r)))}
                />
              </FieldGrid>
              <Button variant="danger" size="sm" className="w-fit" onClick={() => setRooms(b.id, b.rooms.filter((_, idx) => idx !== i))}>
                Xóa phòng
              </Button>
            </ItemAcc>
          ))}
        </section>
      ))}
    </div>
  );
}

export function PackagesEditor({
  packages,
  onChange,
}: {
  packages: Package[];
  onChange: (next: Package[]) => void;
}) {
  function patch(i: number, part: Partial<Package>) {
    onChange(packages.map((item, idx) => (idx === i ? { ...item, ...part } : item)));
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-ma-text-secondary">Sau khi Lưu, khối gói trên trang chủ đọc các gói này.</p>
      <Toolbar
        count={packages.length}
        unit="gói"
        addLabel="+ Thêm gói"
        onAdd={() =>
          onChange([
            {
              id: newId("pkg"),
              tag: "Mới",
              title: "Gói mới",
              sessions: "8 buổi / tháng",
              hold: "Liên hệ bảo lưu",
              deposit: "Không cọc",
              featured: false,
            },
            ...packages,
          ])
        }
      />
      {packages.map((pkg, i) => (
        <ItemAcc key={`${pkg.id}-${i}`} title={pkg.title} chips={[pkg.tag, pkg.featured ? "Nổi bật" : ""]}>
          <FieldGrid>
            <TextField label="ID" value={pkg.id} onChange={(id) => patch(i, { id })} />
            <TextField label="Tag" value={pkg.tag} onChange={(tag) => patch(i, { tag })} />
            <TextField wide label="Tiêu đề" value={pkg.title} onChange={(title) => patch(i, { title })} />
            <TextField wide label="Buổi" value={pkg.sessions} onChange={(sessions) => patch(i, { sessions })} />
            <TextField wide label="Bảo lưu" value={pkg.hold} onChange={(hold) => patch(i, { hold })} />
            <TextField wide label="Cọc" value={pkg.deposit} onChange={(deposit) => patch(i, { deposit })} />
            <Checkbox id={`feat-${pkg.id}-${i}`} label="Nổi bật" checked={pkg.featured} onChange={(featured) => patch(i, { featured })} />
          </FieldGrid>
          <Button variant="danger" size="sm" className="w-fit" onClick={() => onChange(packages.filter((_, idx) => idx !== i))}>
            Xóa gói
          </Button>
        </ItemAcc>
      ))}
    </div>
  );
}

export function StoriesEditor({
  stories,
  onChange,
  onBusy,
}: {
  stories: Story[];
  onChange: (next: Story[]) => void;
  onBusy?: (state: AdminOverlayState | null) => void;
}) {
  function patch(i: number, part: Partial<Story>) {
    onChange(stories.map((item, idx) => (idx === i ? { ...item, ...part } : item)));
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-ma-text-secondary">Sau khi Lưu, teaser stories trên trang chủ lấy 1 featured + 3 story kế.</p>
      <Toolbar
        count={stories.length}
        unit="story"
        addLabel="+ Thêm story"
        onAdd={() =>
          onChange([
            {
              slug: newId("story"),
              date: new Date().toISOString().slice(0, 10),
              kind: "note",
              kindLabel: "Case",
              image: "studio-01.jpg",
              imageAlt: "",
              title: "Story mới",
              excerpt: "",
              body: [""],
            },
            ...stories,
          ])
        }
      />
      {stories.map((story, i) => (
        <ItemAcc key={`${story.slug}-${i}`} title={story.title} chips={[story.kindLabel || story.kind, story.date]} thumb={story.image}>
          <FieldGrid>
            <TextField label="Slug" value={story.slug} onChange={(slug) => patch(i, { slug })} />
            <TextField label="Ngày" type="date" value={story.date} onChange={(date) => patch(i, { date })} />
            <SelectField label="Kind" value={story.kind} onChange={(kind) => patch(i, { kind: kind as StoryKind })}>
              {STORY_KINDS.map((kind) => (
                <option key={kind} value={kind}>
                  {kind}
                </option>
              ))}
            </SelectField>
            <TextField label="Nhãn" value={story.kindLabel} onChange={(kindLabel) => patch(i, { kindLabel })} />
            <TextField wide label="Tiêu đề" value={story.title} onChange={(title) => patch(i, { title })} />
            <ImageField label="Ảnh" value={story.image} onChange={(image) => patch(i, { image })} onBusy={onBusy} />
            <TextField wide label="Alt" value={story.imageAlt} onChange={(imageAlt) => patch(i, { imageAlt })} />
            <Field label="Excerpt" wide>
              <Textarea rows={2} value={story.excerpt} onChange={(e) => patch(i, { excerpt: e.target.value })} />
            </Field>
            <Field label="Body (mỗi dòng 1 đoạn)" wide>
              <Textarea
                rows={5}
                value={story.body.join("\n")}
                onChange={(e) => patch(i, { body: e.target.value.split("\n").filter((line) => line.length > 0) })}
              />
            </Field>
            <TextField
              wide
              label="Watch label"
              value={story.watchLabel || ""}
              onChange={(watchLabel) => patch(i, { watchLabel: watchLabel || undefined })}
            />
            <TextField
              wide
              label="Watch URL"
              value={story.watchHref || ""}
              onChange={(watchHref) => patch(i, { watchHref: watchHref || undefined })}
            />
          </FieldGrid>
          <Button variant="danger" size="sm" className="w-fit" onClick={() => onChange(stories.filter((_, idx) => idx !== i))}>
            Xóa story
          </Button>
        </ItemAcc>
      ))}
    </div>
  );
}

export function BranchesEditor({
  branches,
  onChange,
}: {
  branches: Branch[];
  onChange: (next: Branch[]) => void;
}) {
  function patch(id: BranchId, part: Partial<Branch>) {
    onChange(branches.map((b) => (b.id === id ? { ...b, ...part } : b)));
  }

  return (
    <div className="grid gap-4">
      <p className="text-sm text-ma-text-secondary">Sau khi Lưu, khối chi nhánh trên trang chủ đọc từ đây.</p>
      {BRANCH_IDS.map((id) => {
        const b = branches.find((item) => item.id === id);
        if (!b) return null;
        return (
          <ItemAcc key={id} title={b.name} chips={[id.toUpperCase(), `${b.rooms.length} phòng`]}>
            <FieldGrid>
              <TextField wide label="Tên" value={b.name} onChange={(name) => patch(id, { name })} />
              <TextField wide label="Địa chỉ" value={b.address} onChange={(address) => patch(id, { address })} />
              <TextField wide label="Ghi chú" value={b.note} onChange={(note) => patch(id, { note })} />
            </FieldGrid>
          </ItemAcc>
        );
      })}
    </div>
  );
}
