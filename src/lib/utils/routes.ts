import type {OnNavigate} from "@sveltejs/kit";



export type AuthedRoute = "/home" | "/editor" | "/leaderboard" | "/profile"; //| "/about";

type NonAuthedRoutes = "/" | "/auth" | "/auth/error";

export type RedirectableRoute = AuthedRoute | NonAuthedRoutes;
export type RedirectableRouteWithGroup = `/(authed)${AuthedRoute}` | NonAuthedRoutes;


export type RedirectMap = Record<RedirectableRoute, string | null>;
export type RoutePageTitleMap = Record<RedirectableRouteWithGroup, string>;



const routePageTitleMappings: RoutePageTitleMap = {
	"/(authed)/home": "Home",
	"/(authed)/editor": "Log editor",
	"/(authed)/leaderboard": "Leaderboard",
	"/(authed)/profile": "User profile",
	// "/(authed)/about": "About Lumberjack",

	"/auth": "Sign in",
	"/auth/error": "Error!",

	"/": "Landing"
};



export const navbarRoutes: AuthedRoute[] = ["/home", "/leaderboard", "/profile"];

export const routeAriaLabelMappings: Record<AuthedRoute, string> = {
	"/home": "Navigate to home page",
	"/editor": "Navigate to log editor",
	"/leaderboard": "Navigate to the points leaderboad",
	"/profile": "Navigate to your profile page",
	// "/about": "Navigate to the about page"
};



const allRoutes = Object.keys(routePageTitleMappings);



export function mapRouteToPageTitle(routeToMap: string | null) {
	if(routeToMap === null || !isRouteInMappings(routeToMap)) {
		return "JCS Lumberjack";
	}


	return `${routePageTitleMappings[routeToMap]} | Lumberjack`;
}



export function getPageTransitionDirection(currentRoute: string | null, targetRoute?: string | null) {
	if(!targetRoute || !currentRoute ||
	   !isRouteInMappings(currentRoute) || !isRouteInMappings(targetRoute))
	{
		return "right";
	}

	const currentRouteIndex = allRoutes.indexOf(currentRoute);
	const targetRouteIndex = allRoutes.indexOf(targetRoute);


	if(currentRouteIndex > targetRouteIndex) {
		return "left";
	}


	return "right";
}



export function enableCorrectTransitionForNavigation(navigation: OnNavigate, currentPageRoute: string | null) {
	return new Promise<void>(resolve => {
		const slideDirection = getPageTransitionDirection(currentPageRoute, navigation.to?.route.id);


		// the target screen is coming in from the left
		if(slideDirection === "left") {
			document.documentElement.classList.add("sliding-in-from-left");
			document.documentElement.classList.remove("sliding-in-from-right");
		} else {
			document.documentElement.classList.add("sliding-in-from-right");
			document.documentElement.classList.remove("sliding-in-from-left");
		}


		document.startViewTransition(async () => {
			resolve();

			await navigation.complete;
		});
	});
}



function isRouteInMappings(route: string): route is RedirectableRouteWithGroup {
	return allRoutes.includes(route);
}
