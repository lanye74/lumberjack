export type AuthedRoute = "/home" | "/editor" | "/leaderboard" | "/profile";

type NonAuthedRoutes = "/" | "/auth" | "/auth/error";

export type RedirectableRoute = AuthedRoute | NonAuthedRoutes;
export type RedirectableRouthWithGroup = `/(authed)${AuthedRoute}` | NonAuthedRoutes;

export type RedirectMap = {[key in RedirectableRoute]: string | null};
export type RoutePageTitleMap = {[key in RedirectableRouthWithGroup]: string};
