export type AuthedRoute = "/home" | "/form" | "/leaderboard" | "/profile" | "/about"; // "/editor"

type NonAuthedRoutes = "/" | "/auth" | "/auth/error";

export type RedirectableRoute = AuthedRoute | NonAuthedRoutes;
export type RedirectableRouteWithGroup = `/(authed)${AuthedRoute}` | NonAuthedRoutes;


export type RedirectMap = Record<RedirectableRoute, string | null>;
export type RoutePageTitleMap = Record<RedirectableRouteWithGroup, string>;
