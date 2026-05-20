"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AppSessionUser } from "@/lib/types";

const SessionContext = createContext<AppSessionUser | null>(null);

export function SessionProvider({
  user,
  children,
}: {
  user: AppSessionUser;
  children: ReactNode;
}) {
  return (
    <SessionContext.Provider value={user}>{children}</SessionContext.Provider>
  );
}

export function useAppSession(): AppSessionUser {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useAppSession must be used within SessionProvider");
  }
  return ctx;
}
