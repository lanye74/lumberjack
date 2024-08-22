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



export default function mapRouteToPageTitle(routeToMap: string | null) {
	if(routeToMap === null || !isRouteInMappings(routeToMap)) {
		return "JCS Lumberjack";
	}


	return routePageTitleMappings[routeToMap];
}



function isRouteInMappings(route: string): route is PossibleRoute {
	return allRoutes.includes(route as PossibleRoute);
}
