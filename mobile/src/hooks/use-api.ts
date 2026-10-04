import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";

type State<T> = { data: T | null; error: string | null; loading: boolean };

// Loads a GET endpoint and reloads it when the path changes. `reload` refetches (pull to refresh).
export function useApi<T>(path: string | null) {
  const [state, setState] = useState<State<T>>({ data: null, error: null, loading: !!path });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    api<T>(path, { signal: controller.signal })
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState((current) => ({
          data: current.data,
          error: error instanceof ApiError ? error.message : "Something went wrong.",
          loading: false,
        }));
      });
    return () => controller.abort();
  }, [path, attempt]);

  const reload = useCallback(() => {
    setState((current) => ({ ...current, loading: true }));
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, reload };
}
