import { useEffect, useState } from "react";
import MStudios from "./MStudios";
import InvestigationLab from "./InvestigationLab";
import Compare from "./Compare";

type Route = "compare" | "m-studios" | "lab";

function routeFromHash(): Route {
  const h = location.hash;
  if (h.includes("lab")) return "lab";
  if (h.includes("m-studios")) return "m-studios";
  return "compare";
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
          href="#compare"
          data-active={route === "compare"}
          onClick={() => setRoute("compare")}
        >
          Cursor vs REA
        </a>
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
      {route === "lab" ? (
        <InvestigationLab />
      ) : route === "m-studios" ? (
        <MStudios />
      ) : (
        <Compare />
      )}
    </>
  );
}
