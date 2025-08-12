import type {ProfileIndexedList} from "$types/forms.js";



// TODO: make this less bad
export const jcsSites: ProfileIndexedList = {
	ast: ["ASH", "BES", "EJHS", "EJMS", "JCTC", "JELV", "NES", "RDES", "RED", "TPS", "WAR", "WES", "WJHS", "WJMS"],

	maint: ["Annex", "ASH", "BES", "Bradley Building", "Bus Garage", "CO", "EJHS", "EJMS", "JCTC", "JELV", "Maintenance", "NES", "PAC Center", "RDES", "RED", "TPS", "Transportation Department", "WAR", "WES", "WJHS", "WJMS"]
};



export const possibleVisitPurposes: ProfileIndexedList = {
	ast: [
		"Arts walk",
		"CKLA walk",
		"enVision walk",
		"iReady walk",
		"OpenSciEd walk",
		"PBIS walk",
		"PLC visit",
		"SDI/MSD walk",
		"StudySync walk",
		"Superintendent walk",
		"Testing walk",
		"Unannounced walk",
	],

	maint: [
		"Training",
		"Grounds inspection",
		"Building inspection",
		"Vendor follow-up",
		"Other"
	]
};
