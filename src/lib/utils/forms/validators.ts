import {jcsSites, possibleVisitPurposes} from "$utils/forms/options.js";
import type {InputState} from "$utils/forms/FormStateManager.svelte.js";
import isTimeSelectorValid from "$utils/forms/isTimeSelectorValid.js";

import type {TimeSelector} from "$types/forms.js";
import type {ProfilePrefix} from "$types/profiles.js";



export type QuestionValidationState = "unanswered" | "invalid" | "complete";



type ValidatingFunction =
	((value: string, prefix: ProfilePrefix) => QuestionValidationState) |
	((value: TimeSelector) => QuestionValidationState) |
	((value: string) => QuestionValidationState);

type Validators = Record<keyof InputState, ValidatingFunction>;



export const validators: Validators = {
	timeInputMethod: (value: string) => validateTimeInputMethod(value),
	customTime: (time: TimeSelector) => validateCustomTime(time),
	selectedSite: (site: string, prefix: ProfilePrefix) => validateSelectedSite(site, prefix),
	selectedPurpose: (purpose: string, prefix: ProfilePrefix) => validateSelectedPurpose(purpose, prefix),
	typedPurpose: (purpose: string) => purpose !== "" ? "complete" : "unanswered"
};



function validateTimeInputMethod(value: string) {
	if(value === "") return "unanswered";

	return ["Use current time", "Input custom time"].includes(value) ?
		"complete" :
		"invalid";
}



function validateCustomTime(time: TimeSelector) {
	if(isNaN(time.hours) || isNaN(time.minutes)) {
		return "unanswered";
	}

	return isTimeSelectorValid(time) ? "invalid" : "complete";
}



function validateSelectedSite(site: string, prefix: ProfilePrefix) {
	if(site === "") return "unanswered";

	return jcsSites[prefix].includes(site) ?
		"complete" :
		"invalid";
}



function validateSelectedPurpose(purpose: string, prefix: ProfilePrefix) {
	if(purpose === "") return "unanswered";

	return possibleVisitPurposes[prefix].includes(purpose) ?
		"complete" :
		"invalid";
}
