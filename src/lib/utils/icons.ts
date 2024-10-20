import HomeIcon from "virtual:icons/fa-solid/home";
import PencilIcon from "virtual:icons/fa-solid/pencil-alt";
import TrophyIcon from "virtual:icons/fa-solid/trophy";
import ProfileIcon from "virtual:icons/fa-solid/user-circle";
// import InfoIcon from "virtual:icons/fa-solid/info-circle";
import ExchangeAlt from "virtual:icons/fa-solid/exchange-alt";
import SignOutAlt from "virtual:icons/fa-solid/sign-out-alt";

import type {AuthedRoute} from "$types/routing.js";



export type IconComponent = typeof ProfileIcon;

export const iconComponentMap: Record<string, IconComponent> = {
	"user-circle": ProfileIcon,
	"exchange-alt": ExchangeAlt,
	"sign-out-alt": SignOutAlt
};

export type IconComponentId = keyof typeof iconComponentMap;




export const routeIconMappings: Record<AuthedRoute, IconComponent> = {
	"/home": HomeIcon,
	"/editor": PencilIcon,
	"/leaderboard": TrophyIcon,
	"/profile": ProfileIcon,
	// "/about": InfoIcon
};
