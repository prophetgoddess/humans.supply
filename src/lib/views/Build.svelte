<script lang="ts">
	import Building from '$lib/views/Building.svelte';
	import { world } from '$lib/EntityStorage';
	import { Facility } from '$lib/Components';

	$: available = $world.filter((e) => {
		let result = e.components.find((c) => c.id == 'Facility');
		if (result !== undefined) {
			let building = result as Facility;
			return building.unlocked && !building.purchased;
		}

		return false;
	});

	$: built = $world.filter((e) => {
		let result = e.components.find((c) => c.id === 'Facility');
		if (result !== undefined) {
			let building = result as Facility;
			return building.purchased;
		}

		return false;
	});
</script>

<div class="panel">
	<div class="panel" style="grid-column: 1/2">
		<h3>Available Facilities</h3>
		{#each available as building}
			<Building entity={building} />
		{/each}
	</div>

	<div class="panel" style="grid-column: 2/2">
		{#each built as building}
			<Building entity={building} />
		{/each}
	</div>
</div>
