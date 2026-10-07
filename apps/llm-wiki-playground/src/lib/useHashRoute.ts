import { useEffect, useState } from "react";
import { parseRoute, routeToHash, type Route } from "./route";

export function useHashRoute(): [Route, (route: Route) => void] {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (next: Route) => {
    const hash = routeToHash(next);
    if (window.location.hash === hash) {
      setRoute(next);
    } else {
      window.location.hash = hash;
    }
  };

  return [route, navigate];
}
