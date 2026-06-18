import { useCallback, useEffect, useState } from "react";
import { parseHash, buildHash, type Route } from "./routes";

export function useHashRoute(): { route: Route; navigate: (route: Route) => void } {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    onChange();
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    const hash = buildHash(next);
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
    setRoute(next);
    try {
      window.scrollTo({ top: 0 });
    } catch {
      /* jsdom has no scrollTo */
    }
  }, []);

  return { route, navigate };
}
