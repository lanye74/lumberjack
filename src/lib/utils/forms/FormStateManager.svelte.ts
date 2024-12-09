import isTimeSelectorValid from "$utils/forms/isTimeSelectorValid.js";
import {jcsSites, possibleVisitPurposes} from "$utils/forms/options.js";

import type {TimeSelector} from "$types/forms.js";
import type {ProfilePrefix} from "$types/profiles.js";



type QuestionStates = "unanswered" | "invalid" | "complete";

export type InputState = {
	timeInputMethod: "Use current time" | "Input custom time";
	customTime: TimeSelector;
	selectedSite: string;
	selectedPurpose: string;
	typedPurpose: string;
};

type QuestionState = {
	time: QuestionStates;
	site: QuestionStates;
	purpose: QuestionStates;
	submit: QuestionStates;
};



const defaultInputState: InputState = {
	timeInputMethod: "Use current time",
	customTime: {hours: NaN, minutes: NaN, period: "AM"},
	selectedSite: "",
	selectedPurpose: "",
	typedPurpose: ""
};



type Validators = Record<keyof InputState, (value: any, prefix: ProfilePrefix) => boolean>;

const validators: Validators = {
	timeInputMethod: (value: string) => ["Use current time", "Input custom time"].includes(value),
	customTime: (time: TimeSelector) => isTimeSelectorValid(time),
	selectedSite: (site: string, prefix: ProfilePrefix) => jcsSites[prefix].includes(site),
	selectedPurpose: (purpose: string, prefix: ProfilePrefix) => possibleVisitPurposes[prefix].includes(purpose),
	typedPurpose: () => true
};



// TODO: name this less generally
export class FormStateManager {
	currentQuestion: number = $state(0);
	questionStates: QuestionStates[] = $state(new Array(4).fill("unanswered"));
	inputState: InputState = $state(Object.assign({}, defaultInputState));
	profile: ProfilePrefix;

	constructor(profile: ProfilePrefix) {
		this.profile = profile;
	}

	recomputeQuestionStates() {
		// for(const [input, state] of Object.entries(this.inputState)) {
		// }
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
