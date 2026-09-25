"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { branches, courses, packages } from "@/lib/discovery-data";

export function EnrollPageClient() {
  const params = useSearchParams();
  const prefCourse = params.get("course") || "";
  const prefPkg = params.get("package") || "3m";
  const pref = courses.find((c) => c.id === prefCourse);

  const [branch, setBranch] = useState(pref?.branch || "q10");
  const [courseId, setCourseId] = useState(prefCourse);
  const [pkg, setPkg] = useState(prefPkg);
  const [isChild, setIsChild] = useState(false);
  const [sent, setSent] = useState(false);

  const courseOpts = useMemo(
    () => courses.filter((c) => c.branch === branch),
    [branch],
  );
  const selectedPkg = packages.find((p) => p.id === pkg);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
    window.setTimeout(() => setSent(false), 2500);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <>
      <ol className="ma-steps">
        <li>Chọn chi nhánh & khóa</li>
        <li>Chọn gói</li>
        <li>Thông tin HV / PH</li>
        <li>Chờ xác nhận</li>
      </ol>

      <form className="ma-lead-form" onSubmit={onSubmit}>
        <fieldset>
          <legend>Khóa học</legend>
          <label>
            Chi nhánh
            <select
              required
              value={branch}
              onChange={(e) => {
                setBranch(e.target.value as typeof branch);
                setCourseId("");
              }}
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Khóa
            <select
              required
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              <option value="">Chọn khóa</option>
              {courseOpts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.style} · {c.level} · {c.schedule} ({c.seats}/{c.cap})
                </option>
              ))}
            </select>
          </label>
          <label>
            Gói học phí
            <select required value={pkg} onChange={(e) => setPkg(e.target.value)}>
              {packages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} · {p.deposit}
                </option>
              ))}
            </select>
          </label>
          {selectedPkg ? (
            <p className="ma-hint">
              {selectedPkg.hold}. {selectedPkg.deposit}. Giá: Liên hệ.
            </p>
          ) : null}
        </fieldset>

        <fieldset>
          <legend>Học viên</legend>
          <label>
            Họ tên học viên
            <input name="studentName" required autoComplete="name" />
          </label>
          <label className="ma-check">
            <input
              type="checkbox"
              checked={isChild}
              onChange={(e) => setIsChild(e.target.checked)}
            />
            HV là trẻ em (điểm danh = tên HV; liên hệ & TT = PH)
          </label>
          {isChild ? (
            <div className="ma-row">
              <label>
                Họ tên phụ huynh
                <input name="parentName" />
              </label>
              <label>
                Ngày sinh HV
                <input type="date" name="dob" />
              </label>
            </div>
          ) : null}
          <div className="ma-row">
            <label>
              Zalo / SĐT
              <input name="phone" type="tel" required autoComplete="tel" />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Ghi chú</legend>
          <label>
            Vào giữa khóa?
            <select name="midJoin" defaultValue="no">
              <option value="no">Không — khai giảng</option>
              <option value="yes">Có — theo rule level</option>
            </select>
          </label>
          <label>
            Ghi chú thêm
            <textarea name="message" rows={3} placeholder="Khung giờ / câu hỏi…" />
          </label>
        </fieldset>

        <p className="ma-legal">
          Lễ tân / quản lý xác nhận sĩ số, gói và cọc (nếu 6–12 tháng) qua Zalo.
        </p>
        <button type="submit" className="btn btn-primary btn-full">
          {sent ? "Đã gửi!" : "Gửi đăng ký"}
        </button>
        {sent ? (
          <p className="ma-success">Đã nhận yêu cầu. Team MA sẽ nhắn Zalo sớm.</p>
        ) : null}
      </form>
    </>
  );
}
