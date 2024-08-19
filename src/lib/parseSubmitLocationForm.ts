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
	// though i would like to believe these fields always exist, can't trust the client xd
	const userLocation = formData.get("location-selector")?.toString().trim() ?? "";
	const userPurposeMultiple = formData.get("purpose-selector")?.toString().trim() ?? "";
	// in the formData, this field does not exist if disabled disabled (i.e., null when userPurposeMultiple !== "Other")
	const userPurposeText = formData.get("location-purpose")?.toString().trim() ?? "";

	const didTypePurpose = userPurposeMultiple === "Other";
	const userPurpose = didTypePurpose ? userPurposeText : userPurposeMultiple;


	const isValid = userLocation !== "" &&
	                userPurpose !== "" &&
	                jcsSites.includes(userLocation) &&
	                possibleVisitPurposes.includes(userPurposeMultiple);

	// TODO: return specific errors
	const errorMessage = isValid === false ? "Invalid form!" : null;


	return {
		isValid,
		errorMessage,

		userLocation: isValid ? userLocation : null,
		userPurpose: isValid ? userPurpose : null,
		didTypePurpose: isValid ? didTypePurpose : null
	} as ParsedSubmitLocationForm;
}



type ParsedSubmitLocationForm = {
	isValid: true;
	errorMessage: null;

	userLocation: string;
	userPurpose: string;
	didTypePurpose: boolean;
} | {
	isValid: false;
	errorMessage: string;

	userLocation: null;
	userPurpose: null;
	didTypePurpose: null;
};
