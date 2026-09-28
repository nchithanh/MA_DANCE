import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";

const control =
  "w-full rounded-xl border border-ma-border bg-ma-bg px-3 py-2.5 text-sm text-ma-text transition placeholder:text-ma-text-muted focus:border-ma-accent focus:outline-none focus:ring-2 focus:ring-ma-accent/30 disabled:opacity-40";

const buttonStyles = {
  primary: "bg-ma-accent text-black hover:bg-ma-accent-hover",
  secondary: "border border-ma-border bg-transparent text-ma-text-secondary hover:bg-ma-card-hover hover:text-ma-text",
  danger: "text-ma-danger hover:bg-ma-danger/10",
} as const;

const badgeStyles = {
  success: "bg-ma-success/15 text-ma-success",
  muted: "bg-ma-card-hover text-ma-text-secondary",
  accent: "bg-ma-accent-muted text-ma-accent",
  danger: "bg-ma-danger/15 text-ma-danger",
  warning: "bg-ma-accent-muted text-ma-accent",
} as const;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonStyles;
  size?: "sm" | "md";
}) {
  const sizing = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm";
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition duration-200 disabled:pointer-events-none disabled:opacity-40 ${sizing} ${buttonStyles[variant]} ${className}`}
      {...props}
    />
  );
}

export function Badge({
  tone = "muted",
  children,
}: {
  tone?: keyof typeof badgeStyles;
  children: ReactNode;
}) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-medium tracking-wide ${badgeStyles[tone]}`}>
      {children}
    </span>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${control} ${props.className || ""}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${control} min-h-24 resize-y ${props.className || ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${control} ${props.className || ""}`} />;
}

export function Field({
  label,
  hint,
  wide,
  children,
}: {
  label: string;
  hint?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={wide ? "grid gap-1.5 sm:col-span-2" : "grid content-start gap-1.5"}>
      <span className="flex items-baseline justify-between gap-3 text-xs font-medium tracking-wide text-ma-text-secondary">
        <span>{label}</span>
        {hint}
      </span>
      {children}
    </label>
  );
}

export function FieldGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function Checkbox({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2.5 text-sm text-ma-text sm:col-span-2">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded border-ma-border bg-ma-bg accent-ma-accent"
      />
      {label}
    </label>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-ma-border bg-ma-card shadow-[0_16px_40px_rgba(0,0,0,0.28)] ${className}`}>
      {children}
    </section>
  );
}

export function CollapseCard({
  id,
  title,
  icon,
  badge,
  thumb,
  children,
  open,
  onToggle,
}: {
  id?: string;
  title: string;
  icon?: ReactNode;
  badge?: ReactNode;
  thumb?: string;
  children: ReactNode;
  open?: boolean;
  onToggle?: (open: boolean) => void;
}) {
  return (
    <details
      id={id}
      className="group scroll-mt-36 rounded-2xl border border-ma-border bg-ma-card shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
      open={open}
      onToggle={onToggle ? (e) => onToggle((e.target as HTMLDetailsElement).open) : undefined}
    >
      <summary className="flex cursor-pointer items-center gap-3 px-4 py-3.5 transition hover:bg-ma-card-hover sm:px-5">
        {thumb ? (
          <img src={thumb} alt="" className="size-9 shrink-0 rounded-lg object-cover" />
        ) : icon ? (
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-ma-accent-muted text-ma-accent">{icon}</span>
        ) : null}
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-ma-text">{title || "Không tên"}</span>
        {badge}
        <ChevronDown className="size-4 shrink-0 text-ma-text-muted transition duration-200 group-open:rotate-180" aria-hidden />
      </summary>
      <div className="grid gap-4 border-t border-ma-border px-4 py-5 sm:px-5">{children}</div>
    </details>
  );
}
