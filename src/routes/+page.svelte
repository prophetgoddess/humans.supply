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
		ReproductionChamber,
		SolitaryConfinement
	} from '$lib/Components';

	let reproductionChamber = world.createEntity();
	world.setComponent(reproductionChamber, new Facility(10, 50, FacilityType.Worker, true));
	world.setComponent(reproductionChamber, new ReproductionChamber());

	let meatGrinder = world.createEntity();
	world.setComponent(meatGrinder, new Facility(10, 50, FacilityType.Processor, true));
	world.setComponent(meatGrinder, new MeatGrinder());

	let solitaryConfinement = world.createEntity();
	world.setComponent(solitaryConfinement, new Facility(10, 50, FacilityType.Processor, true));
	world.setComponent(solitaryConfinement, new SolitaryConfinement());

	let money = world.createEntity();
	world.setComponent(money, new Money(300));

	let h = world.createEntity();
	world.setComponent(h, new Human());

	let h2 = world.createEntity();
	world.setComponent(h2, new Human());
</script>

<Stats />

<Build />
