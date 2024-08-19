export const jcsSites = [
	"ASH",
	"BES",
	"EJHS",
	"EJMS",
	"JCS",
	"JCTC",
	"JELV",
	"NES",
	"RDES",
	"RED",
	"TPS",
	"WAR",
	"WES",
	"WJHS",
	"WJMS"
];



export const possibleVisitPurposes = [
	"Administration team meeting",
	"Check-in visit",
	"Problem-solving support",
	"Scheduled walkthrough",
	"Unannounced walkthrough",
	"Other"
];



export function parseSubmitLocationForm(formData: FormData): ParsedSubmitLocationForm {
	const userLocation = formData.get("location-selector")!.toString().trim();
	const userPurposeMultiple = formData.get("purpose-selector")!.toString().trim();
	const wasTyped = userPurposeMultiple === "Other";

	// null if disabled (i.e., null when userPurposeMultiple !== "Other")
	const userPurposeText = formData.get("location-purpose");

	const userPurpose = ((userPurposeMultiple !== "Other") ? userPurposeMultiple : userPurposeText!).toString().trim();


	if(userLocation === "" || userPurpose === "") {
		return {
			isValid: false,
			userLocation: null,
			userPurpose: null,
			wasTyped: null
		};
	}


	return {
		isValid: true,
		userLocation,
		userPurpose,
		wasTyped
	};
}



type ParsedSubmitLocationForm = {
	isValid: true;
	userLocation: string;
	userPurpose: string;
	wasTyped: boolean;
} | {
	isValid: false;
	userLocation: null;
	userPurpose: null;
	wasTyped: null;
};
