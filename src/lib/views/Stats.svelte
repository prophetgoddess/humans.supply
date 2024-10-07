<script lang="ts">
	import { Money, Event, Rudeness } from '$lib/Components';
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
		world.setComponent(msg, new Event(message));
	}

	let populationThreshold = 2;
	let populationEventIndex = 0;

	let rudeThreshold = 0;
	let rudeEventIndex = 0;

	function ease(x: number): number {
		return x * x * x;
	}

	function debugWorld() {
		console.log($world);
	}

	createMessage(events.game_start[0]);

	tick.subscribe((value) => {
		if (populationEventIndex < events.human_repro.length) {
			if (population > populationThreshold) {
				createMessage(events.human_repro[populationEventIndex]);
				populationEventIndex++;
				populationThreshold += 10 * populationEventIndex;
			}
		}

		if (rudeEventIndex < events.rude_human.length) {
			if (rudeHumans > rudeThreshold) {
				createMessage(events.rude_human[rudeEventIndex]);
				rudeEventIndex++;
				rudeThreshold += 10 * rudeEventIndex;
			}
		}

		let singleton = $world.find((e) => e.components.find((c) => c.id == 'Rudeness') !== undefined);

		if (singleton != undefined) {
			let rudeness = singleton.components.find((c) => c.id == 'Rudeness') as Rudeness;
			let newRudeness = (rudeHumans * 1.1) / population;

			if (population < 3) {
				newRudeness = 0;
			} else if (population < 100) {
				newRudeness = 0.1;
			}

			if (rudeness != undefined) {
				0;
				world.setComponent(singleton, new Rudeness(newRudeness * 0.9));
			}
		}
	});
</script>

<div style="text-align: center; border-style: solid; padding: 4px; margin: 2px;">
	<span>
		Total Humans: {population}
		| Unused Humans: {freeHumans}
		{#if obedientHumans > 0}
			| Obedient Humans: {obedientHumans}
		{/if}
		{#if rudeHumans > 0}
			| Rude Humans: {rudeHumans}
		{/if}
		| Money: {money}
		<button on:click={debugWorld}>debug</button>
	</span>
</div>
