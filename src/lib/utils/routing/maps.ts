import type {RoutePageTitleMap, AuthedRoute} from "$types/routing.js";



export const routePageTitleMappings: RoutePageTitleMap = {
	"/(authed)/home": "Home",
	"/(authed)/editor": "Log editor",
	"/(authed)/leaderboard": "Leaderboard",
	"/(authed)/profile": "User profile",
	// "/(authed)/about": "About Lumberjack",

	"/auth": "Sign in",
	"/auth/error": "Error!",

	"/": "Landing"
};

export const allRoutes = Object.keys(routePageTitleMappings);



export const routeAriaLabelMappings: Record<AuthedRoute, string> = {
	"/home": "Navigate to home page",
	"/editor": "Navigate to log editor",
	"/leaderboard": "Navigate to the points leaderboad",
	"/profile": "Navigate to your profile page",
	// "/about": "Navigate to the about page"
};



export const navbarRoutes: AuthedRoute[] = ["/home", "/leaderboard", "/profile"];
