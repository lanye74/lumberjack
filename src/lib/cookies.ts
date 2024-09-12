import type {Cookies} from "@sveltejs/kit";
import type {SupabaseClient} from "@supabase/supabase-js";
import type {ProfilePrefix} from "./types/profiles.js";
import {defaultProfilePrefix, profilePrefixes} from "./profiles.js";



type PointsCookieJson = {[key in ProfilePrefix]: number | null};

const defaultPointsCookie: PointsCookieJson = {
	ast: null,
	maint: null
};

function generateDefaultPointsCookie() {
	return Object.assign({}, defaultPointsCookie);
}



function getUserPointsCookie(cookies: Cookies) {
	const pointsCookie = cookies.get("lumberjack_user_points")?.toString();
	const pointsJson = JSON.parse(pointsCookie ?? "0");

	// quick check if cookie needs to be version-migrated (or if default condition is triggered above)
	return (pointsCookie === undefined || typeof pointsJson === "number")
		? generateDefaultPointsCookie()
		: pointsJson;
}



// returns current profile's points
// TODO: name these better
export async function setUserPointsCookie(cookies: Cookies, supabase: SupabaseClient, profilePrefix: ProfilePrefix, userId: string) {
	const pointsJson = generateDefaultPointsCookie();


	// TODO: error handling????????
	const pointsValue = pointsJson[profilePrefix] ?? await dbFetchUserPoints(supabase, profilePrefix, userId);
	pointsJson[profilePrefix] = pointsValue;

	cookies.set("lumberjack_user_points", JSON.stringify(pointsJson), {path: "/"});


	return pointsValue;
}



export function updateUserPointsCookie(cookies: Cookies, profilePrefix: ProfilePrefix, value: number) {
	const pointsJson = getUserPointsCookie(cookies);
	pointsJson[profilePrefix] = value;

	cookies.set("lumberjack_user_points", JSON.stringify(pointsJson), {path: "/"});
}



export async function getProfileCookie(cookies: Cookies, supabase: SupabaseClient, userId: string) {
	let profileCookie = cookies.get("lumberjack_user_profile")?.toString() as ProfilePrefix;

	const profile = profileCookie ? profileCookie : await dbFetchUserProfile(supabase, userId);


	return profile;
}





export function setUserProfileCookie(cookies: Cookies, profilePrefix: ProfilePrefix) {
	cookies.set("lumberjack_user_profile", profilePrefix, {path: "/"});
}



export async function getUserProfilePrefixCookie(cookies: Cookies, supabase: SupabaseClient, userId: string) {
	let profilePrefix = cookies.get("lumberjack_user_profile")?.toString();


	// unfortunate typecast here
	if(!profilePrefix || !profilePrefixes.includes(profilePrefix as ProfilePrefix)) {
		profilePrefix = await dbFetchUserProfile(supabase, userId);
	}

	setUserProfileCookie(cookies, profilePrefix as ProfilePrefix);

	return profilePrefix as ProfilePrefix;
}




export function setHasSubmittedLogRecentlyCookie(cookies: Cookies, state: boolean) {
	cookies.set("lumberjack_has_submitted_log_recently", `${state}`, {path: "/"});
}



export function getHasSubmittedLogRecentlyCookie(cookies: Cookies) {
	const value = cookies.get("lumberjack_has_submitted_log_recently")?.toString();

	if(value === undefined) {
		setHasSubmittedLogRecentlyCookie(cookies, false);

		return false;
	}


	return value === "true";
}





async function dbFetchUserPoints(supabase: SupabaseClient, profilePrefix: string, userId: string) {
	const {data, error} = await supabase.from(`${profilePrefix}_leaderboard`)
		.select("points")
		.eq("google_user_id", userId)
		.single();


	if(error && error.code !== "PGRST116") {
		return null;
	}


	return data?.points as number ?? 0;
}



async function dbFetchUserProfile(supabase: SupabaseClient, userId: string): Promise<ProfilePrefix> {
	const {data} = await supabase.from("public_user_data")
		.select("profile")
		.eq("google_user_id", userId)
		.single();

	return (data?.profile as ProfilePrefix ?? defaultProfilePrefix);
}
