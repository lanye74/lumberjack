import type {QuestionValidationState} from "$utils/forms/validators.js";

import type {TimeSelector} from "$types/forms.js";
import type {ProfilePrefix} from "$types/profiles.js";



export type InputState = {
	timeInputMethod: "Use current time" | "Input custom time";
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
const defaultInputValidationState: Record<string, QuestionValidationState> = {

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

	}

	reset() {
		this.inputState = Object.assign({}, defaultInputState);
		this.recomputeQuestionStates();
	}

	set state(state: InputState) {
		this.inputState = state;
		this.recomputeQuestionStates();
	}

	get state() {
		// TODO:
		return null as unknown as InputState;
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
