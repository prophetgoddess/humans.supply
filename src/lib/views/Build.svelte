<script lang="ts">
	import Building from '$lib/views/Building.svelte';
	import { world } from '$lib/EntityStorage';
	import { Facility, Name } from '$lib/Components';

	$: available = $world.filter((e) => {
		let result = e.components.find((c) => c.id == 'Facility');
		if (result !== undefined) {
			let building = result as Facility;
			return building.unlocked && !building.purchased;
		}

		return false;
	});

	$: built = $world
		.filter((e) => {
			let result = e.components.find((c) => c.id === 'Facility');
			if (result !== undefined) {
				let building = result as Facility;
				return building.purchased;
			}

			return false;
		})
		.sort((a, b) => {
			let aNameComponent = a.components.find((c) => c.id === 'Name') as Name;
			let bNameComponent = b.components.find((c) => c.id === 'Name') as Name;
			if (aNameComponent !== undefined && bNameComponent !== undefined) {
				let aName = aNameComponent.value.toUpperCase();
				let bName = bNameComponent.value.toUpperCase();
				return aName.localeCompare(bName);
			}
			return 0;
		});
</script>

<div class="panel">
	<div class="panel" style="grid-column: 1/2">
		<h3>Available Facilities</h3>
		{#each available as building (building.id)}
			<Building entity={building} />
		{/each}
	</div>

	<div class="panel" style="grid-column: 2/2">
		{#each built as building (building.id)}
			<Building entity={building} />
		{/each}
	</div>
</div>
