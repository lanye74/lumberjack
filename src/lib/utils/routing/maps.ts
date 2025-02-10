import type {AuthedRoute, RedirectableRouteWithGroup} from "$types/routing.js";



// TODO: i wonder if there's ever a world in which i can derive these programmatically
// like, could i have a function that walks the src/routes tree?
// maybe each folder gets like a route_metadata.json file that has title, aria label, etc
// and then these can be compiled into a record from there
export const routePageTitleMappings: Record<RedirectableRouteWithGroup, string> = {
	"/(authed)/home": "Home",
	// "/(authed)/editor": "Log editor",
	"/(authed)/form": "Form submission",
	"/(authed)/leaderboard": "Leaderboard",
	"/(authed)/profile": "User profile",
	"/(authed)/about": "About Lumberjack",

	"/auth": "Sign in",
	"/auth/error": "Error!",

	"/": "Landing"
};

export const allRoutes = Object.keys(routePageTitleMappings);



export const routeAriaLabelMappings: Record<AuthedRoute, string> = {
	"/home": "Navigate to home page",
	// "/editor": "Navigate to log editor",
	"/form": "Submit a location log",
	"/leaderboard": "Navigate to the points leaderboad",
	"/profile": "Navigate to your profile page",
	"/about": "Navigate to the about page"
};



export const navbarRoutes: AuthedRoute[] = ["/home", "/leaderboard", "/profile", "/about"];
export const authedRoutes: AuthedRoute[] = ["/home", "/form", "/leaderboard", "/profile", "/about"];
