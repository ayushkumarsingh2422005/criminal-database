"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        password: fd.get("password"),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Login failed");
      return;
    }

    const from = searchParams.get("from") || "/search";
    router.push(from);
    router.refresh();
  }

  return (
    <main className="flex min-h-full flex-1 items-center justify-center p-4">
      <section className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-white p-8 shadow-lg">
        <header className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)] text-lg font-bold text-white">
            CD
          </span>
          <h1 className="text-2xl font-bold text-slate-900">Criminal Database</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Admin-only access. Sign in to continue.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="admin@example.com"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="admin123"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <section className="mt-6 rounded-lg border border-[var(--color-border)] bg-slate-50 px-4 py-3 text-center text-xs text-[var(--color-muted)]">
          <p className="font-medium text-slate-700">Default superadmin</p>
          <p className="mt-1">
            Email: <span className="font-mono text-slate-800">admin@example.com</span>
          </p>
          <p>
            Password: <span className="font-mono text-slate-800">admin123</span>
          </p>
          <p className="mt-2">Passwords are case-sensitive.</p>
        </section>
      </section>
    </main>
  );
}
