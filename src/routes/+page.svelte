<script lang="ts">
	import Build from '$lib/views/Build.svelte';
	import Stats from '$lib/views/Stats.svelte';

	import { createEventDispatcher } from 'svelte';

	import { world } from '$lib/EntityStorage';
	import {
		Facility,
		FacilityType,
		Human,
		MeatGrinder,
		Money,
		Name,
		ReproductionChamber,
		SolitaryConfinement
	} from '$lib/Components';
	import { names } from '$lib/data/Names';

	let reproductionChamber = world.createEntity();
	world.setComponent(reproductionChamber, new Facility(10, 50, FacilityType.Worker, true));
	world.setComponent(reproductionChamber, new ReproductionChamber());
	world.setComponent(reproductionChamber, new Name(names.ReproductionChamber.singular));

	let meatGrinder = world.createEntity();
	world.setComponent(meatGrinder, new Facility(10, 50, FacilityType.Processor, true));
	world.setComponent(meatGrinder, new MeatGrinder());
	world.setComponent(meatGrinder, new Name(names.MeatGrinder.singular));

	let solitaryConfinement = world.createEntity();
	world.setComponent(solitaryConfinement, new Facility(10, 50, FacilityType.Processor, true));
	world.setComponent(solitaryConfinement, new SolitaryConfinement());
	world.setComponent(solitaryConfinement, new Name(names.SolitaryConfinement.singular));

	let money = world.createEntity();
	world.setComponent(money, new Money(300));

	let h = world.createEntity();
	world.setComponent(h, new Human());

	let h2 = world.createEntity();
	world.setComponent(h2, new Human());
</script>

<Stats />

<Build />
