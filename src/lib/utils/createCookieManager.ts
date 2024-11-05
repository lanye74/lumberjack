import type {Cookies} from "@sveltejs/kit";

import {profilePrefixes} from "$utils/profiles.js";
import {fetchUserPoints, fetchUserProfile} from "$utils/database/user.js";

import type {ProfilePrefix} from "$types/profiles.js";
import type {TypedSupabaseClient} from "$types/database.js";



type PointsCookieJson = Record<ProfilePrefix, number | null>;

const defaultPointsCookie: PointsCookieJson = {
	ast: null,
	maint: null
};

function generateDefaultPointsCookie() {
	return Object.assign({}, defaultPointsCookie);
}



export default function createCookieManager(cookies: Cookies, supabase?: TypedSupabaseClient) {
	return {
		getProfilePoints: (profilePrefix: ProfilePrefix, userId: string) => getProfilePoints(cookies, supabase!, profilePrefix, userId),
		setProfilePoints: (profilePrefix: ProfilePrefix, points: number) => setProfilePointsCookie(cookies, profilePrefix, points),

		getProfile: (userId: string) => getProfile(cookies, supabase!, userId),
		setProfile: (profilePrefix: ProfilePrefix) => setProfileCookie(cookies, profilePrefix),

		getLogSubmissionStatus: () => getLogSubmissionStatus(cookies),
		setLogSubmissionStatus: (state: boolean) => setLogSubmissionStatusCookie(cookies, state),

		deleteCookies: () => deleteCookies(cookies)
	};
}



function getPointsCookie(cookies: Cookies): PointsCookieJson {
	const pointsCookie = cookies.get("lumberjack_user_points");
	const pointsJson = JSON.parse(pointsCookie ?? "0");

	// quick check if cookie needs to be version-migrated (or if default condition is triggered above)
	return (pointsCookie === undefined || typeof pointsJson !== "object")
		? generateDefaultPointsCookie()
		: pointsJson;
}



// returns current profile's points
async function getProfilePoints(cookies: Cookies, supabase: TypedSupabaseClient, profilePrefix: ProfilePrefix, userId: string) {
	const pointsJson = getPointsCookie(cookies);
	// TODO: can i use ??= here?
	const points = pointsJson[profilePrefix] ?? await fetchUserPoints(supabase, profilePrefix, userId);

	pointsJson[profilePrefix] = points;
	cookies.set("lumberjack_user_points", JSON.stringify(pointsJson), {path: "/"});

	return points;
}



// TODO: change this to avoid duplicated code from above
function setProfilePointsCookie(cookies: Cookies, profilePrefix: ProfilePrefix, value: number) {
	const pointsJson = getPointsCookie(cookies);
	pointsJson[profilePrefix] = value;

	cookies.set("lumberjack_user_points", JSON.stringify(pointsJson), {path: "/"});
}



async function getProfile(cookies: Cookies, supabase: TypedSupabaseClient, userId: string) {
	const profileCookie = cookies.get("lumberjack_user_profile") as ProfilePrefix;
	const isInvalidCookie = (profileCookie === undefined || !profilePrefixes.includes(profileCookie));

	const profile = isInvalidCookie ? await fetchUserProfile(supabase, userId) : profileCookie;

	// fun fact: i forgot to include this line, which caused a billion more database reads and increased load times by >100ms!
	if(isInvalidCookie) setProfileCookie(cookies, profile);

	return profile;
}



function setProfileCookie(cookies: Cookies, profilePrefix: ProfilePrefix) {
	cookies.set("lumberjack_user_profile", profilePrefix, {path: "/"});
}



function getLogSubmissionStatus(cookies: Cookies) {
	const value = cookies.get("lumberjack_has_submitted_log_recently");

	if(value === undefined ||
	   (value !== "true" && value !== "false")) {
		setLogSubmissionStatusCookie(cookies, false);

		return false;
	}


	return value === "true";
}



function setLogSubmissionStatusCookie(cookies: Cookies, state: boolean) {
	cookies.set("lumberjack_has_submitted_log_recently", `${state}`, {path: "/"});
}



function deleteCookies(cookies: Cookies) {
	cookies.delete("lumberjack_has_submitted_log_recently", {path: "/"});
	cookies.delete("lumberjack_user_points", {path: "/"});
	cookies.delete("lumberjack_user_profile", {path: "/"});
}
