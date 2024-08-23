import type {OnNavigate} from "@sveltejs/kit";



const routePageTitleMappings = {
	"/(authed)/home": "Home",
	"/(authed)/editor": "Log editor",
	"/(authed)/leaderboard": "Leaderboard",
	"/(authed)/profile": "User profile",

	"/auth/": "Sign in",
	"/auth/error": "Error!",
};

type PossibleRoute = keyof typeof routePageTitleMappings;

const allRoutes = Object.keys(routePageTitleMappings) as PossibleRoute[];



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
	// @ts-ignore
	if(!document.startViewTransition) return;

	if(navigation.to?.route.id === currentPageRoute) return;


	return new Promise<void>(resolve => {
		const slideDirection = getPageTransitionDirection(currentPageRoute, navigation.to?.route.id);


		// the target screen is coming in from the left
		if(slideDirection === "left") {
			document.documentElement.classList.add("sliding-in-from-left");
			document.documentElement.classList.remove("sliding-in-from-right");
		} else {
			console.log("right")
			document.documentElement.classList.add("sliding-in-from-right");
			document.documentElement.classList.remove("sliding-in-from-left");
		}


		// @ts-ignore
		document.startViewTransition(async () => {
			resolve();

			await navigation.complete;
		});
	});
}



function isRouteInMappings(route: string): route is PossibleRoute {
	return allRoutes.includes(route as PossibleRoute);
}
