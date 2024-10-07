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
	world.setComponent(singleton, new Money(1000));
	world.setComponent(singleton, new Rudeness(0.1));
	world.setComponent(singleton, new Upgrade(1));

	let h = world.createEntity();
	world.setComponent(h, new Human());

	let h2 = world.createEntity();
	world.setComponent(h2, new Human());

	let topbar: HTMLElement | undefined;
	let build: HTMLElement | undefined;

	$: topbarHeight = topbar?.offsetHeight;
</script>

<div
	bind:this={topbar}
	style="
	position: fixed;
	top: 0;
	max-height: 250px;
	border-style: solid;
	background-color: #fff;
"
>
	<Stats />
	<Events />
</div>
<div bind:this={build} style="padding-top: 250px;">
	<Build />
</div>

<p>
	a game by <a href="https://blood.church/">cassandra lugo</a> (programming) and
	<a href="https://blog.lauramichet.com/">laura michet</a> (writing)
</p>
