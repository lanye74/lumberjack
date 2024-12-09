import type {TimeSelector} from "$types/forms.js";



type QuestionState = "unanswered" | "invalid" | "complete";

type InputState = {
	timeInputMethod: "Use current time" | "Input custom time";
	customTime: TimeSelector;
	selectedSite: string;
	selectedPurpose: string;
	typedPurpose: string;
};

export {FormStateManager, type InputState};



const defaultInputState: InputState = {
	timeInputMethod: "Use current time",
	customTime: {hours: NaN, minutes: NaN, period: "AM"},
	selectedSite: "",
	selectedPurpose: "",
	typedPurpose: ""
};



// TODO: name this less generally
class FormStateManager {
	currentQuestion: number = $state(0);
	questionStates: QuestionState[] = $state(new Array(4).fill("unanswered"));
	inputState: InputState = $state(Object.assign({}, defaultInputState));

	constructor() { }

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
