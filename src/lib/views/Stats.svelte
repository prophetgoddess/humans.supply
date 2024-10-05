<script lang="ts">
	import type { Money } from '$lib/Components';
	import { world } from '$lib/EntityStorage';

	$: population = $world.reduce((total, e) => {
		if (e.components.find((c) => c.id === 'Human') !== undefined) {
			return total + 1;
		}
		return total;
	}, 0);
	$: freeHumans = $world.reduce((total, e) => {
		if (
			e.components.find((c) => c.id === 'Human') !== undefined &&
			e.components.find((c) => c.id === 'Working') === undefined
		) {
			return total + 1;
		}
		return total;
	}, 0);

	$: money = $world.reduce((total, e) => {
		let component = e.components.find((c) => c.id == 'Money');

		if (component !== undefined) {
			return (component as Money).value;
		}

		return total;
	}, 0);
	//$: averageMood = humans.reduce((total: number, { mood }) => total + mood, 0) / population;
</script>

<div class="panel">
	<h2>Stats</h2>
	Total Humans: {population}
	| Unused Humans: {freeHumans}
	| Average Mood: 0 | Money: {money}
</div>
