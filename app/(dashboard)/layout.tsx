import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth";
import { buildAppSessionUser } from "@/lib/session-user";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppContainer } from "@/components/layout/AppContainer";
import { SessionProvider } from "@/components/session/SessionProvider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();
  if (!session) redirect("/login");

  const user = await buildAppSessionUser(session);

  return (
    <SessionProvider user={user}>
      <section className="flex min-h-full flex-1 flex-col">
        <AppHeader user={user} />
        <main className="w-full flex-1 py-6">
          <AppContainer>{children}</AppContainer>
        </main>
      </section>
    </SessionProvider>
  );
}
