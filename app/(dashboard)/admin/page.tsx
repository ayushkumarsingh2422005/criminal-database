import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";
import { getSessionFromCookies } from "@/lib/auth";
import { redirect } from "next/navigation";

const panels = [
  {
    href: "/admin/users",
    title: "Admin Management",
    description: "Create and manage admin accounts. Superadmin only.",
    icon: "👤",
    color: "bg-blue-50 text-blue-700",
    superadminOnly: true,
  },
  {
    href: "/admin/case-types",
    title: "Case Type Management",
    description: "Manage crime/case types used in criminal records.",
    icon: "📋",
    color: "bg-green-50 text-green-700",
    superadminOnly: true,
  },
  {
    href: "/admin/police-stations",
    title: "Police Station Management",
    description: "Manage police stations for Case PS field.",
    icon: "🏛️",
    color: "bg-purple-50 text-purple-700",
    superadminOnly: true,
  },
];

export default async function AdminControlPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect("/login");

  const visible = panels.filter(
    (p) => !p.superadminOnly || session.role === "superadmin"
  );

  return (
    <section className="w-full space-y-6">
      <PageHeader
        title="Admin Control"
        subtitle="System configuration and user management."
      />

      <section className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((panel) => (
          <Link key={panel.href} href={panel.href} className="block h-full w-full">
            <Card className="h-full w-full transition hover:border-[var(--color-primary)] hover:shadow-md">
              <section className="flex items-start gap-4">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-xl ${panel.color}`}
                >
                  {panel.icon}
                </span>
                <section>
                  <h2 className="font-semibold text-slate-900">{panel.title}</h2>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    {panel.description}
                  </p>
                </section>
              </section>
            </Card>
          </Link>
        ))}
      </section>
    </section>
  );
}
