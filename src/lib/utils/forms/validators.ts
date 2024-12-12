import {jcsSites, possibleVisitPurposes} from "$utils/forms/options.js";
import isTimeSelectorValid from "$utils/forms/isTimeSelectorValid.js";

import type {ProfilePrefix} from "$types/profiles.js";
import type {QuestionValidationState, TimeSelector} from "$types/forms.js";



export function validateTimeInput(dropdownChoice: string, customTime: TimeSelector): QuestionValidationState {
	// note: this shouldn't happen, so be care
	if(dropdownChoice === "") return "unanswered";
	if(dropdownChoice === "Use current time") return "complete";
	// at this point, input custom time should be the only possibililty
	if(dropdownChoice !== "Input custom time") return "invalid";


	if(isNaN(customTime.hours) || isNaN(customTime.minutes)) {
		return "unanswered";
	}

	return isTimeSelectorValid(customTime) ? "invalid" : "complete";
}



export function validateSite(site: string, prefix: ProfilePrefix): QuestionValidationState {
	if(site === "") return "unanswered";

	return jcsSites[prefix].includes(site) ?
		"complete" :
		"invalid";
}



export function validatePurpose(dropdownChoice: string, typedPurpose: string, prefix: ProfilePrefix): QuestionValidationState {
	if(dropdownChoice === "") return "unanswered";

	// dropdown is a made-up value it shouldn't be, or "Other" is selected with no input
	if((dropdownChoice !== "Other" && !possibleVisitPurposes[prefix].includes(dropdownChoice)) ||
	   (dropdownChoice === "Other" && typedPurpose === "")) {
		return "invalid";
	}

	return "complete";
}



export function validateSubmit(states: QuestionValidationState[]): QuestionValidationState {
	if(states.includes("unanswered")) {
		return "unanswered";
	}

	if(states.includes("invalid")) {
		return "invalid";
	}

	return "complete";
}
