"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AppContainer } from "@/components/layout/AppContainer";

interface User {
  email: string;
  name: string;
  role: string;
}

const navItems = [
  { href: "/search", label: "Search" },
  { href: "/criminals", label: "Criminal Management" },
  { href: "/admin", label: "Admin Control" },
];

export function AppHeader({ user }: { user: User }) {
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
          {navItems.map((item) => {
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
          <Link
            href="/criminals"
            className="hidden rounded-lg bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-dark)] sm:inline-flex"
          >
            + Add Criminal
          </Link>
          <section className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-800">{user.email}</p>
            <p className="text-xs capitalize text-[var(--color-muted)]">
              {user.role}
            </p>
          </section>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </section>
      </AppContainer>

      <nav className="border-t border-[var(--color-border)] md:hidden">
        <AppContainer className="flex gap-1 overflow-x-auto py-2">
          {navItems.map((item) => {
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
