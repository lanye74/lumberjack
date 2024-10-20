import type {ProfileIndexedList} from "$types/forms.js";



// TODO: make this not bad
export const jcsSites: ProfileIndexedList = {
	ast: ["ASH", "BES", "EJHS", "EJMS", "JCTC", "JELV", "NES", "RDES", "RED", "TPS", "WAR", "WES", "WJHS", "WJMS"],

	maint: ["Annex", "ASH", "BES", "Bradley Building", "Bus Garage", "CO", "EJHS", "EJMS", "JCTC", "JELV", "Maintenance", "NES", "PAC Center", "RDES", "RED", "TPS", "Transportation Department", "WAR", "WES", "WJHS", "WJMS"]
};



export const possibleVisitPurposes: ProfileIndexedList = {
	ast: [
		"Administration team meeting",
		"Check-in visit",
		"Problem-solving support",
		"Scheduled walkthrough",
		"Unannounced walkthrough",
		"Other"
	],

	maint: [
		"Training",
		"Grounds inspection",
		"Building inspection",
		"Vendor follow-up",
		"Other"
	]
};
