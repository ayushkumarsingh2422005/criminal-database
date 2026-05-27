"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IconButton } from "@/components/ui/IconButton";
import { IconLogOut } from "@/components/ui/icons";
import { AppContainer } from "@/components/layout/AppContainer";

import type { AppSessionUser } from "@/lib/types";

type NavItem = {
  href: string;
  label: string;
  superadminOnly?: boolean;
  adminOnly?: boolean;
  ioHidden?: boolean;
};

const navItems: NavItem[] = [
  { href: "/search", label: "Search" },
  { href: "/criminals", label: "Criminal Management", adminOnly: true, ioHidden: true },
  { href: "/transfer", label: "Transfer", adminOnly: true, ioHidden: true },
  {
    href: "/investigation-officers",
    label: "Investigation Officers",
    adminOnly: true,
    ioHidden: true,
  },
  { href: "/admin", label: "Admin Control", superadminOnly: true, ioHidden: true },
];

function canSeeNavItem(item: NavItem, role: AppSessionUser["role"]) {
  if (item.ioHidden && role === "io") return false;
  if (item.superadminOnly) return role === "superadmin";
  if (item.adminOnly) return role === "admin";
  return true;
}

export function AppHeader({ user }: { user: AppSessionUser }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-white shadow-sm">
      <AppContainer className="flex items-center justify-between gap-4 py-3">
        <section className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
            CD
          </span>
          <section>
            <h1 className="text-base font-bold text-slate-900 sm:text-lg">
              Criminal Database
            </h1>
            <p className="hidden text-xs text-[var(--color-muted)] sm:block">
              Admin search & management
            </p>
          </section>
        </section>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems
            .filter((item) => canSeeNavItem(item, user.role))
            .map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <section className="flex items-center gap-2 sm:gap-3">
          <section className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-800">{user.email}</p>
            <p className="text-xs capitalize text-[var(--color-muted)]">
              {user.role}
              {user.policeStationName
                ? ` · ${user.policeStationName}`
                : ""}
            </p>
          </section>
          <IconButton label="Logout" variant="secondary" onClick={handleLogout}>
            <IconLogOut />
          </IconButton>
        </section>
      </AppContainer>

      <nav className="border-t border-[var(--color-border)] md:hidden">
        <AppContainer className="flex gap-1 overflow-x-auto py-2">
          {navItems
            .filter((item) => canSeeNavItem(item, user.role))
            .map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium ${
                  active
                    ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                    : "text-slate-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </AppContainer>
      </nav>
    </header>
  );
}
