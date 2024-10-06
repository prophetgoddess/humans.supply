<script lang="ts">
	import Build from '$lib/views/Build.svelte';
	import Stats from '$lib/views/Stats.svelte';
	import Events from '$lib/views/Events.svelte';

	import { tick } from '$lib/Time';

	import { world } from '$lib/EntityStorage';
	import {
		Facility,
		Human,
		Money,
		Name,
		Rude,
		Event,
		FacilityType,
		Rudeness,
		Description,
		Upgrade
	} from '$lib/Components';
	import { names } from '$lib/data/Names';

	let reproductionChamber = world.createEntity();
	world.setComponent(
		reproductionChamber,
		new Facility(FacilityType.ReproductionChamber, 10, 50, true)
	);
	world.setComponent(reproductionChamber, new Name(names.ReproductionChamber.singular));
	world.setComponent(reproductionChamber, new Description(names.ReproductionChamber.description));

	let meatGrinder = world.createEntity();
	world.setComponent(meatGrinder, new Facility(FacilityType.MeatGrinder, 10, 100, true));
	world.setComponent(meatGrinder, new Name(names.MeatGrinder.singular));
	world.setComponent(meatGrinder, new Description(names.MeatGrinder.description));

	let solitaryConfinement = world.createEntity();
	world.setComponent(
		solitaryConfinement,
		new Facility(FacilityType.SolitaryConfinement, 10, 100, true)
	);
	world.setComponent(solitaryConfinement, new Name(names.SolitaryConfinement.singular));
	world.setComponent(solitaryConfinement, new Description(names.SolitaryConfinement.description));

	let singleton = world.createEntity();
	world.setComponent(singleton, new Money(10000));
	world.setComponent(singleton, new Rudeness(0.01));
	world.setComponent(singleton, new Upgrade(1));

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
			let newRudeness = easeOutCirc(rudeHumans / 5000.0);
			if (rudeness != undefined) {
				world.setComponent(singleton, new Rudeness(newRudeness * 0.7));
			}
		}
	});
</script>

<Stats />

<Build />

<Events />
