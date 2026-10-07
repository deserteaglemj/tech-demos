export type Route =
  | { type: "index" }
  | { type: "wiki"; slug: string }
  | { type: "graph" };

export function parseRoute(hash: string): Route {
  const clean = hash.replace(/^#/, "");
  const wikiMatch = /^\/wiki\/([a-z0-9-]+)\/?$/.exec(clean);
  if (wikiMatch) return { type: "wiki", slug: wikiMatch[1] };
  if (/^\/graph\/?$/.test(clean)) return { type: "graph" };
  return { type: "index" };
}

export function routeToHash(route: Route): string {
  switch (route.type) {
    case "wiki":
      return `#/wiki/${route.slug}`;
    case "graph":
      return "#/graph";
    default:
      return "#/";
  }
}
