"use client";
import { useEffect, useState } from "react";

export interface ClientSession {
  userId: string;
  role: "CUSTOMER" | "STORE_OWNER" | "ADMIN";
  name: string;
  email: string;
}

export function useSession() {
  const [session, setSession] = useState<ClientSession | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setSession(data.user ?? null))
      .catch(() => setSession(null));
  }, []);

  return session; // undefined = loading, null = signed out
}
