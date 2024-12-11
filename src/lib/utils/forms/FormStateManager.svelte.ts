// TODO: this sucks
import * as validity from "$utils/forms/validators.js";

import type {TimeSelector} from "$types/forms.js";
import type {ProfilePrefix} from "$types/profiles.js";



type InputState = {
	timeInputMethod: string;
	customTime: TimeSelector;
	selectedSite: string;
	selectedPurpose: string;
	typedPurpose: string;
};



const defaultInputState: InputState = {
	timeInputMethod: "Use current time",
	customTime: {hours: NaN, minutes: NaN, period: "AM"},
	selectedSite: "",
	selectedPurpose: "",
	typedPurpose: ""
};



// TODO: ARGHHHHHHHHHHHH
const defaultInputValidationState: validity.ValidationState = {
	time: "unanswered",
	site: "unanswered",
	purpose: "unanswered",
	submit: "unanswered"
};



// TODO: name this less generally
export class FormStateManager {
	currentQuestion: number = $state(0);
	questionStates = $state(Object.assign({}, defaultInputValidationState));
	inputState: InputState = $state(Object.assign({}, defaultInputState));
	profile: ProfilePrefix;

	constructor(profile: ProfilePrefix) {
		this.profile = profile;
	}

	recomputeQuestionStates() {
		this.questionStates.time = validity.validateTimeInput(this.inputState.timeInputMethod, this.customTime);
		this.questionStates.site = validity.validateSite(this.inputState.selectedSite, this.profile);
		this.questionStates.purpose = validity.validatePurpose(this.inputState.selectedPurpose, this.typedPurpose, this.profile);
		this.questionStates.submit = validity.validateSubmit([this.questionStates.time, this.questionStates.submit, this.questionStates.purpose]);
	}

	reset() {
		this.inputState = Object.assign({}, defaultInputState);
		this.recomputeQuestionStates();
	}

	// ew
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
