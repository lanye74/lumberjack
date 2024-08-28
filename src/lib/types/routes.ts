export type AuthedRoute = "/home" | "/editor" | "/leaderboard" | "/profile";

export type RedirectableRoute = AuthedRoute | "/" | "/auth";

// TODO: does this really belong here?
export type RedirectMap = {[key in RedirectableRoute]: string | null};
