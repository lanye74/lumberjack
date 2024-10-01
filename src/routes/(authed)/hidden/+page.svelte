<script lang="ts">
	import {writable} from "svelte/store";

	type Toast = {
		duration: number;
		content: string;
		toastNumber: number;
	};



	function createToasterWritable() {
		const {subscribe, update} = writable<Toast[]>([]);

		let index = 0;

		return {
			subscribe,

			// what the fuck
			toast: () => {
				update(old => {
					let thisIndex = index++;

					setTimeout(() => {
						// oh my god why did I do this
						update(oldNew => {
							const arrIndex = oldNew.findIndex(toast => toast.toastNumber === thisIndex);

							const firstHalf = oldNew.slice(0, arrIndex);
							const secondHalf = oldNew.slice(arrIndex + 1);

							return [...firstHalf, ...secondHalf]
						})
					}, 1000);

					return [...old, {
						duration: 3,
						content: "hey",
						toastNumber: thisIndex
					}]
				})
			}
		};
	}



	const realToaster = createToasterWritable();

	$: console.log($realToaster);
</script>

<button on:click={() => realToaster.toast()}>button</button>