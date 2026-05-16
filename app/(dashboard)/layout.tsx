import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppContainer } from "@/components/layout/AppContainer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();
  if (!session) redirect("/login");

  return (
    <section className="flex min-h-full flex-1 flex-col">
      <AppHeader
        user={{
          email: session.email,
          name: session.name,
          role: session.role,
        }}
      />
      <main className="w-full flex-1 py-6">
        <AppContainer>{children}</AppContainer>
      </main>
    </section>
  );
}
