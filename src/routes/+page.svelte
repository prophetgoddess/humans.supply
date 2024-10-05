<script lang="ts">
	import Build from '$lib/Build.svelte';

	const starterHumans = 2;

	interface Human {
		mood: number;
	}

	let humans: Human[] = [];

	function seedHumans(): void {
		for (let i = 0; i < starterHumans; i++) {
			birth();
		}
	}

	function createHuman(): Human {
		return {
			mood: 0.0
		};
	}

	$: population = humans.length;
	$: averageMood = humans.reduce((total: number, { mood }) => total + mood, 0) / population;

	function birth(): void {
		humans = [...humans, createHuman()];
	}

	seedHumans();
</script>

<div class="panel">
	<h2>Stats</h2>
	Humans: {population}
	Mood: {averageMood}
</div>

<Build />
