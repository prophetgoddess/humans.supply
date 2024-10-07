<script lang="ts">
	import { Money, Event, Rudeness, Facility, FacilityType } from '$lib/Components';
	import { world } from '$lib/EntityStorage';
	import { tick } from '$lib/Time';
	import { events } from '$lib/data/Events';

	class EventTracker {
		threshold: number;
		index: number = 0;
		events: string[];
		constructor(threshold: number, events: string[]) {
			this.threshold = threshold;
			this.events = events;
		}

		update(n: number) {
			if (n > this.threshold) {
				createMessage(this.events[this.index]);
				this.index++;
				this.threshold += 10 * this.index;
			}
		}
	}

	$: population = $world.reduce((total, e) => {
		if (e.components.find((c) => c.id === 'Human') !== undefined) {
			return total + 1;
		}
		return total;
	}, 0);
	let populationTracker = new EventTracker(2, events.human_repro);

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
	let rudeTracker = new EventTracker(2, events.rude_human);

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

	$: reproChambers =
		$world.filter((e) => {
			let facility = e.components.find((c) => c.id === 'Facility') as Facility;

			if (facility !== undefined) {
				if (facility.type == FacilityType.ReproductionChamber) {
					return true;
				}
			}

			return false;
		}).length - 1;
	let reproTracker = new EventTracker(0, events.repro_chamber);

	$: meatGrinders =
		$world.filter((e) => {
			let facility = e.components.find((c) => c.id === 'Facility') as Facility;

			if (facility !== undefined) {
				if (facility.type == FacilityType.MeatGrinder) {
					return true;
				}
			}

			return false;
		}).length - 1;
	let meatTracker = new EventTracker(0, events.epicurean_hall);

	$: solitaries =
		$world.filter((e) => {
			let facility = e.components.find((c) => c.id === 'Facility') as Facility;

			if (facility !== undefined) {
				if (facility.type == FacilityType.SolitaryConfinement) {
					return true;
				}
			}

			return false;
		}).length - 1;
	let solitaryTracker = new EventTracker(0, events.iso_chamber);

	function createMessage(message: string) {
		let msg = world.createEntity();
		world.setComponent(msg, new Event(message));
	}

	function debugWorld() {
		console.log($world);
	}

	createMessage(events.game_start[0]);

	tick.subscribe((value) => {
		populationTracker.update(population);
		rudeTracker.update(rudeHumans);
		reproTracker.update(reproChambers);
		meatTracker.update(meatGrinders);
		solitaryTracker.update(solitaries);

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
	</span>
</div>
