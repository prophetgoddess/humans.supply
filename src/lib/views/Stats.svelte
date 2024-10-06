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

	function createMessage(message: string) {
		let msg = world.createEntity();
		world.setComponent(msg, new Event(message, 10));
	}

	let populationThreshold = 2;
	let populationEventIndex = 0;

	let rudeThreshold = 1;
	let rudeEventIndex = 0;

	tick.subscribe((value) => {
		if (populationEventIndex < events.human_repro.length) {
			if (population > populationThreshold) {
				populationThreshold *= 1.15;
				console.log(populationEventIndex);
				createMessage(events.human_repro[populationEventIndex]);
				populationEventIndex++;
			}
		}

		if (rudeEventIndex < events.rude_human.length) {
			if (rudeHumans > rudeThreshold && !events.rude_human[rudeEventIndex]) {
				rudeThreshold *= 1.15;
				createMessage(events.rude_human[rudeEventIndex]);
				rudeEventIndex++;
			}
		}
	});
</script>

<div style="border: solid; padding: 4px; margin: 2px">
	<h2>Stats</h2>
	<p>
		Total Humans: {population}
		| Unused Humans: {freeHumans}
		{#if obedientHumans > 0}
			| Obedient Humans: {obedientHumans}
		{/if}
		{#if rudeHumans > 0}
			| Rude Humans: {rudeHumans}
		{/if}
		| Money: {money}
	</p>
</div>
