import type {OnNavigate} from "@sveltejs/kit";

import {routePageTitleMappings, allRoutes} from "$utils/routing/maps.js";
import type {RedirectableRouteWithGroup} from "$types/routing.js";



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
