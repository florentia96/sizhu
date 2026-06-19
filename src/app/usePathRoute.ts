import { useCallback, useEffect, useState } from "react";
import { parsePath, hrefFor, relFromLocation, type Route } from "./routes";

function current(): Route {
  return parsePath(relFromLocation(window.location.pathname, window.location.search));
}

export function usePathRoute(): { route: Route; navigate: (route: Route) => void } {
  const [route, setRoute] = useState<Route>(current);

  useEffect(() => {
    const onPop = () => setRoute(current());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((next: Route) => {
    const href = hrefFor(next);
    if (window.location.pathname + window.location.search !== href) {
      window.history.pushState(null, "", href);
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
