<script lang="ts">
	import Build from '$lib/views/Build.svelte';
	import Stats from '$lib/views/Stats.svelte';
	import Events from '$lib/views/Events.svelte';

	import { tick } from '$lib/Time';

	import { world } from '$lib/EntityStorage';
	import {
		Facility,
		Human,
		MeatGrinder,
		Money,
		Name,
		ReproductionChamber,
		Rude,
		Event,
		Rudeness,
		SolitaryConfinement
	} from '$lib/Components';
	import { names } from '$lib/data/Names';

	let reproductionChamber = world.createEntity();
	world.setComponent(reproductionChamber, new Facility(10, 50, true));
	world.setComponent(reproductionChamber, new ReproductionChamber());
	world.setComponent(reproductionChamber, new Name(names.ReproductionChamber.singular));

	let meatGrinder = world.createEntity();
	world.setComponent(meatGrinder, new Facility(10, 50, true));
	world.setComponent(meatGrinder, new MeatGrinder());
	world.setComponent(meatGrinder, new Name(names.MeatGrinder.singular));

	let solitaryConfinement = world.createEntity();
	world.setComponent(solitaryConfinement, new Facility(10, 50, true));
	world.setComponent(solitaryConfinement, new SolitaryConfinement());
	world.setComponent(solitaryConfinement, new Name(names.SolitaryConfinement.singular));

	let singleton = world.createEntity();
	world.setComponent(singleton, new Money(200));
	world.setComponent(singleton, new Rudeness(0.05));

	let h = world.createEntity();
	world.setComponent(h, new Human());

	let h2 = world.createEntity();
	world.setComponent(h2, new Human());

	$: rudeHumans = $world.reduce((total, e) => {
		if (
			e.components.find((c) => c.id === 'Human') !== undefined &&
			e.components.find((c) => c.id === 'Rude') !== undefined
		) {
			return total + 1;
		}
		return total;
	}, 0);

	function easeOutCirc(x: number): number {
		return Math.sqrt(1 - Math.pow(x - 1, 2));
	}

	tick.subscribe((value) => {
		if (rudeHumans === undefined || rudeHumans === 0) {
			return;
		}

		let singleton = $world.find((e) => e.components.find((c) => c.id == 'Rudeness') !== undefined);

		if (singleton != undefined) {
			let rudeness = singleton.components.find((c) => c.id == 'Rudeness') as Rudeness;
			let newRudeness = easeOutCirc(rudeHumans / 1000.0);
			console.log(newRudeness);
			if (rudeness != undefined) {
				world.setComponent(singleton, new Rudeness(newRudeness));
			}
		}
	});
</script>

<Stats />

<Build />

<Events />
