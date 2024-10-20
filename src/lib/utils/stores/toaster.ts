import {writable} from "svelte/store";



function createToaster() {
	const {subscribe, set, update} = writable<Toast[]>([]);
	// maps Toast.id to the corresponding timeout
	const timeouts = new Map<number, NodeJS.Timeout>();
	let nextId = 0;


	function removeToast(id: number) {
		const timeout = timeouts.get(id);

		if(timeout) {
			clearInterval(timeout);
			timeouts.delete(id);
		}

		// neat trick i learned from an LLM to remove an id'd element from an array
		update(toasts => toasts.filter(toast => toast.id !== id));
	}



	return {
		subscribe,

		// fun little type trick
		toast: (toast: Omit<Toast, "id">) => {
			const id = nextId++;
			const timeout = setTimeout(() => removeToast(id), toast.duration);
			timeouts.set(id, timeout);

			update(toasts => [...toasts, {...toast, id}]);

			return id;
		},

		dismiss: (id: number) => removeToast(id),

		clear: () => {
			timeouts.forEach(timeout => clearInterval(timeout));
			timeouts.clear();
			set([]);
		}
	};
}



const toaster = createToaster();

export default toaster;



type Toast = {
	duration: number;
	content: string;
	id: number;
}
