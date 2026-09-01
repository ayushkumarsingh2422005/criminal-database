import Image from "next/image";
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
        <footer className="mt-auto border-t border-[var(--color-border)] bg-white py-3 text-center text-xs text-slate-500">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-4 sm:px-6 lg:px-8">
            <span>Designed &amp; Developed by</span>
            <a
              href="https://digicraft.one"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 font-medium text-slate-700 hover:text-slate-900"
            >
              <Image
                src="/images/digicraft-logo.png"
                alt="DigiCraft Innovation Pvt. Ltd."
                width={18}
                height={18}
                unoptimized
                className="h-4 w-4 rounded-full object-contain"
              />
              <span>DigiCraft Innovation Pvt. Ltd.</span>
              <span className="text-[11px] text-sky-600 group-hover:underline">
                (digicraft.one)
              </span>
            </a>
          </div>
        </footer>
      </section>
    </SessionProvider>
  );
}
