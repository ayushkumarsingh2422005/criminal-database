import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "danger" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]",
  secondary: "bg-slate-700 text-white hover:bg-slate-800",
  outline:
    "border border-[var(--color-border)] bg-white text-slate-700 hover:bg-slate-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-slate-600 hover:bg-slate-100",
};

const sizes = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
};

type IconButtonProps = {
  label: string;
  variant?: Variant;
  size?: "sm" | "md";
  href?: string;
  children: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export function IconButton({
  label,
  variant = "outline",
  size = "sm",
  href,
  children,
  className = "",
  disabled,
  ...props
}: IconButtonProps) {
  const cls = `inline-flex shrink-0 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={cls} title={label} aria-label={label}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cls}
      title={label}
      aria-label={label}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

/** Horizontal group for table row actions */
export function ActionIcons({ children }: { children: ReactNode }) {
  return <section className="flex items-center gap-1">{children}</section>;
}
