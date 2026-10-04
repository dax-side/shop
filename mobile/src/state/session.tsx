import { createContext, use, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { api, setApiToken, setUnauthorizedHandler } from "@/lib/api";
import { onSignIn, startSignIn, type AppSession } from "@/lib/auth";
import { storage } from "@/lib/storage";
import type { Me, User } from "@/lib/types";

type Status = "loading" | "signedOut" | "signedIn";

type SessionValue = {
  status: Status;
  user: User | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (user: User) => void;
};

const SessionContext = createContext<SessionValue | null>(null);
const TOKEN_KEY = "oja.token";
const USER_KEY = "oja.user";

export function SessionProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<User | null>(null);

  const forget = useCallback(async () => {
    setApiToken(null);
    setUser(null);
    setStatus("signedOut");
    await Promise.all([storage.remove(TOKEN_KEY), storage.remove(USER_KEY)]);
  }, []);

  const remember = useCallback(async (session: AppSession) => {
    setApiToken(session.token);
    setUser(session.user);
    setStatus("signedIn");
    await Promise.all([storage.set(TOKEN_KEY, session.token), storage.set(USER_KEY, JSON.stringify(session.user))]);
  }, []);

  // Restore the saved session, then check it is still valid.
  useEffect(() => {
    (async () => {
      const [token, saved] = await Promise.all([storage.get(TOKEN_KEY), storage.get(USER_KEY)]);
      if (!token) return setStatus("signedOut");
      setApiToken(token);
      try {
        setUser(saved ? (JSON.parse(saved) as User) : null);
      } catch {
        setUser(null);
      }
      setStatus("signedIn");
      api<Me>("/api/me")
        .then((me) => {
          setUser(me.user);
          void storage.set(USER_KEY, JSON.stringify(me.user));
        })
        .catch(() => undefined);
    })();
  }, []);

  useEffect(() => {
    // Any 401 means the session was ended elsewhere (signed out, account deleted).
    setUnauthorizedHandler(() => void forget());
    const unsubscribe = onSignIn((session) => void remember(session));
    return () => {
      setUnauthorizedHandler(null);
      unsubscribe();
    };
  }, [forget, remember]);

  const signIn = useCallback(async () => {
    await startSignIn();
  }, []);

  const signOut = useCallback(async () => {
    await api("/api/mobile/session", { method: "DELETE" }).catch(() => undefined);
    await forget();
  }, [forget]);

  const updateUser = useCallback((next: User) => {
    setUser(next);
    void storage.set(USER_KEY, JSON.stringify(next));
  }, []);

  const value = useMemo(
    () => ({ status, user, signIn, signOut, updateUser }),
    [status, user, signIn, signOut, updateUser],
  );
  return <SessionContext value={value}>{children}</SessionContext>;
}

export function useSession() {
  const value = use(SessionContext);
  if (!value) throw new Error("useSession must be used inside <SessionProvider>");
  return value;
}
