<script lang="ts">
	import BorderBox from "$components/BorderBox.svelte";

	import {currentDate, currentFormattedTime} from "$utils/stores/time.js";
	import generateGreeting from "$utils/generateGreeting.js";



	let {data} = $props();
	const user = data.user!;

	// this really doesn't need to be reactive but it'll make me feel fancy
	// there's no way that this is an expensive enough operation i really have to trash it
	let greeting = $derived(generateGreeting(user, $currentDate));
</script>

<style>
	h2, p {
		margin: 0;
	}

	h2 {
		font: bold 2.8rem var(--font-serif);
	}

	p {
		font-size: 2rem;
	}

	span.time {
		font: 600 2rem var(--time-font);
	}


	.tiles {
		display: flex;
		flex-direction: column;
		padding: 0 2rem;
	}

	.tile {
		background-color: var(--jcs-blue);
		color: white;

		border-radius: 1rem;
		padding: 1rem;

		font: 3rem var(--font-serif);

		/* TODO: optimize this svg */
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 327.37702 327.37698'%3E%3Cg transform='translate(-366.20661,-411.71494)'%3E%3Cpath fill='currentColor' d='m 466.85562,413.58115 -19.45722,19.45723 -7.48355,-7.48355 c -2.48826,-2.48828 -6.49196,-2.48829 -8.98024,0 l -50.88812,50.88812 c -2.48828,2.48828 -2.48828,6.49197 0,8.98026 l 7.48355,7.48355 -19.45722,19.45721 c -2.48828,2.48828 -2.48828,6.49198 0,8.98026 l 10.47696,10.47696 c 6.67907,6.67907 17.75472,9.33573 30.42062,7.25905 10.14021,-1.64639 19.99978,-6.1178 28.38136,-12.77816 15.62189,3.87273 26.51046,1.02899 26.51046,1.02899 l 13.47036,13.47038 -8.98025,8.98025 c -6.60422,6.60423 -8.10093,15.84641 -1.49671,22.45065 l 2.24507,2.24506 c 1.23478,1.23479 3.25534,1.23478 4.49012,-10e-6 l 55.37825,-55.37824 c 1.23479,-1.23478 1.23479,-3.25534 0,-4.49012 l -2.24506,-2.24507 c -6.60424,-6.60423 -15.84642,-5.10752 -22.45064,1.49671 l -8.98027,8.98025 -13.47037,-13.47037 c 0,0 2.84375,-10.88857 -1.02899,-26.51045 6.67905,-8.4003 11.15048,-18.25986 12.77816,-28.38137 2.05796,-12.6472 -0.57999,-23.74156 -7.25904,-30.42062 l -10.47697,-10.47697 c -2.48828,-2.48826 -6.49198,-2.48827 -8.98026,0 m -60.598,108.79206 c -7.85772,1.2722 -13.56393,-0.35547 -15.73416,-2.5257 l -2.99342,-2.99342 12.01109,-12.01109 c 6.28618,5.912 12.53494,10.36472 18.52178,13.73231 -3.79789,1.85218 -7.78289,3.14309 -11.80529,3.7979 m 68.08156,-86.34142 c 3.01212,3.01212 3.44243,10.06537 2.52569,15.73416 -0.65482,4.0224 -1.96443,8.02611 -3.81662,11.824 -3.36759,-5.98683 -7.82029,-12.23561 -13.73228,-18.52179 l 12.02979,-12.0298 z' style='fill:%23ffffff;fill-opacity:0.2;stroke-width:0.264583' /%3E%3Cpath fill='currentColor' d='m 630.54408,577.26959 -19.45723,19.45723 -7.48355,-7.48355 c -2.48826,-2.48828 -6.49196,-2.48828 -8.98024,0 l -50.88812,50.88812 c -2.48828,2.48828 -2.48827,6.49196 0,8.98025 l 7.48355,7.48355 -19.45722,19.45721 c -2.48828,2.48828 -2.48828,6.49198 0,8.98026 l 10.47697,10.47696 c 6.67906,6.67907 17.75471,9.33573 30.42061,7.25905 10.14021,-1.64639 19.99978,-6.1178 28.38136,-12.77816 15.62189,3.87273 26.51046,1.02899 26.51046,1.02899 l 13.47037,13.47038 -8.98025,8.98025 c -6.60423,6.60423 -8.10094,15.84641 -1.49671,22.45065 l 2.24507,2.24506 c 1.23478,1.23479 3.25534,1.23478 4.49012,-10e-6 l 55.37825,-55.37824 c 1.23479,-1.23478 1.23479,-3.25534 0,-4.49012 l -2.24506,-2.24507 c -6.60424,-6.60423 -15.84642,-5.10752 -22.45064,1.49671 l -8.98027,8.98025 -13.47037,-13.47037 c 0,0 2.84375,-10.88857 -1.02899,-26.51045 6.67905,-8.4003 11.15048,-18.25986 12.77816,-28.38136 2.05796,-12.6472 -0.57999,-23.74157 -7.25904,-30.42062 l -10.47697,-10.47697 c -2.48828,-2.48827 -6.49198,-2.48828 -8.98026,0 m -60.598,108.79206 c -7.85772,1.2722 -13.56392,-0.35547 -15.73416,-2.5257 l -2.99341,-2.99342 12.01109,-12.01109 c 6.28617,5.912 12.53494,10.36472 18.52177,13.73231 -3.79789,1.85218 -7.78288,3.14309 -11.80529,3.7979 m 68.08157,-86.34142 c 3.01212,3.01212 3.44243,10.06538 2.52569,15.73417 -0.65482,4.0224 -1.96443,8.02611 -3.81662,11.824 -3.36759,-5.98683 -7.82029,-12.23561 -13.73229,-18.52178 l 12.0298,-12.02981 z' style='fill:%23ffffff;fill-opacity:0.2;stroke-width:0.264583' /%3E%3C/g%3E%3C/svg%3E%0A");
		background-size: 4rem 4rem;

		animation: funny 7s infinite linear;
	}


	/* TODO: make a background element that's translated, since background-position does a bunch of style recalcs */
	@keyframes funny {
		from {
			background-position: 0 0;
		}

		to {
			background-position: 4rem 4rem;
		}
	}
</style>



<BorderBox direction="column" gap="1rem">
	<h2>{greeting}</h2>

	<p>What have you been up to? It’s currently <span class="time">{$currentFormattedTime.string}.</span></p>
</BorderBox>

<!-- is this really a nav?
     ...should this file be exempted from the layout? -->
<section class="tiles">
	<div class="tile">
		text
	</div>
</section>
