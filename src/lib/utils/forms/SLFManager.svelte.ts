import {validateTimeInput, validateSite, validatePurpose, validateSubmit} from "$utils/forms/validators.js";

import type {SLFInputState, SLFValidationState} from "$types/forms.js";
import type {ProfilePrefix} from "$types/profiles.js";



const defaultInputState: SLFInputState = {
	dateInputMethod: "Use current date",
	customDate: {},

	timeInputMethod: "Use current time",
	customTime: {hours: NaN, minutes: NaN, period: "AM"},

	selectedSite: "",
	selectedPurpose: "",
	typedPurpose: ""
};

const defaultInputValidationState: SLFValidationState = {
	dateTime: "unanswered",
	site: "unanswered",
	purpose: "unanswered",
	submit: "unanswered"
};



// TODO: is this awful?
export default class SLFManager {
	currentQuestion: number = $state(0);
	questionStates = $state(Object.assign({}, defaultInputValidationState));
	inputState: SLFInputState = $state(Object.assign({}, defaultInputState));
	profile: ProfilePrefix;

	constructor(profile: ProfilePrefix) {
		this.profile = profile;
	}

	recomputeQuestionStates() {
		// TODO: update this
		this.questionStates.dateTime = validateTimeInput(this.inputState.timeInputMethod, this.customTime);
		this.questionStates.site = validateSite(this.inputState.selectedSite, this.profile);
		this.questionStates.purpose = validatePurpose(this.inputState.selectedPurpose, this.typedPurpose, this.profile);
		this.questionStates.submit = validateSubmit([this.questionStates.dateTime, this.questionStates.submit, this.questionStates.purpose]);
	}

	reset() {
		this.inputState = Object.assign({}, defaultInputState);
		this.recomputeQuestionStates();
	}

	// ew
	get dateInputMethod() {return this.inputState.dateInputMethod}
	set dateInputMethod(value) {
		this.inputState.dateInputMethod = value;
		this.recomputeQuestionStates();
	}

	get customDate() {return this.inputState.customDate}
	set customDate(value) {
		this.inputState.customDate = value;
		this.recomputeQuestionStates();
	}



	get timeInputMethod() {return this.inputState.timeInputMethod}
	set timeInputMethod(value) {
		this.inputState.timeInputMethod = value;
		this.recomputeQuestionStates();
	}

	get customTime() {return this.inputState.customTime}
	set customTime(value) {
		this.inputState.customTime = value;
		this.recomputeQuestionStates();
	}



	get selectedSite() {return this.inputState.selectedSite}
	set selectedSite(value) {
		this.inputState.selectedSite = value;
		this.recomputeQuestionStates();
	}

	get selectedPurpose() {return this.inputState.selectedPurpose}
	set selectedPurpose(value) {
		this.inputState.selectedPurpose = value;
		this.recomputeQuestionStates();
	}

	get typedPurpose() {return this.inputState.typedPurpose}
	set typedPurpose(value) {
		this.inputState.typedPurpose = value;
		this.recomputeQuestionStates();
	}
}
