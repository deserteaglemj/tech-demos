import { useEffect, useState } from "react";
import MStudios from "./MStudios";
import InvestigationLab from "./InvestigationLab";

type Route = "m-studios" | "lab";

function routeFromHash(): Route {
  return location.hash.includes("lab") ? "lab" : "m-studios";
}

export default function App() {
  const [route, setRoute] = useState<Route>(routeFromHash);

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <>
      <div className="app-switcher" role="navigation" aria-label="Demo routes">
        <a
          href="#m-studios"
          data-active={route === "m-studios"}
          onClick={() => setRoute("m-studios")}
        >
          M Studios
        </a>
        <a
          href="#lab"
          data-active={route === "lab"}
          onClick={() => setRoute("lab")}
        >
          Inkdesk lab
        </a>
      </div>
      {route === "lab" ? <InvestigationLab /> : <MStudios />}
    </>
  );
}
