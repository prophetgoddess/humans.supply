<script lang="ts">
	import { Money, Event } from '$lib/Components';
	import { world } from '$lib/EntityStorage';
	import { tick } from '$lib/Time';
	import { events } from '$lib/data/Events';

	$: population = $world.reduce((total, e) => {
		if (e.components.find((c) => c.id === 'Human') !== undefined) {
			return total + 1;
		}
		return total;
	}, 0);

	$: freeHumans = $world.reduce((total, e) => {
		if (
			e.components.find((c) => c.id === 'Human') !== undefined &&
			e.components.find((c) => c.id === 'Working') === undefined &&
			e.components.find((c) => c.id === 'Rude') === undefined
		) {
			return total + 1;
		}
		return total;
	}, 0);

	$: rudeHumans = $world.reduce((total, e) => {
		if (
			e.components.find((c) => c.id === 'Human') !== undefined &&
			e.components.find((c) => c.id === 'Rude') !== undefined
		) {
			return total + 1;
		}
		return total;
	}, 0);

	$: obedientHumans = $world.reduce((total, e) => {
		if (
			e.components.find((c) => c.id === 'Human') !== undefined &&
			e.components.find((c) => c.id === 'Obedient') !== undefined
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

	function createMessage(message: string) {
		let msg = world.createEntity();
		world.setComponent(msg, new Event(message, 10));
	}

	tick.subscribe((value) => {
		if (population > 2 && !events.human_repro_1.triggered) {
			events.human_repro_1.triggered = true;
			createMessage(events.human_repro_1.text);
		}
	});
</script>

<div class="panel">
	<h2>Stats</h2>
	Total Humans: {population}
	| Unused Humans: {freeHumans}
	{#if obedientHumans > 0}
		| Obedient Humans: {obedientHumans}
	{/if}
	{#if rudeHumans > 0}
		| Rude Humans: {rudeHumans}
	{/if}
	| Money: {money}
</div>
