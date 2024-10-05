<script lang="ts">
	import { humans } from '$lib/HumanStorage';

	$: population = $humans.length;
	$: averageMood = $humans.reduce((total: number, { mood }) => total + mood, 0) / population;
	$: freeHumans = $humans.reduce(
		(total: number, { available }) => (available ? total + 1 : total),
		0
	);
</script>

<div class="panel">
	<h2>Stats</h2>
	Total Humans: {population}
	| Unused Humans: {freeHumans}
	| Average Mood: {averageMood}
</div>
