<script lang="ts">
	import Building from '$lib/buildings/Building.svelte';
	import ReproductionChamber from '$lib/buildings/ReproductionChamber.svelte';
	import { built, available } from '$lib/BuildingStorage';
</script>

<div class="panel">
	<h2>Buildings</h2>

	<div class="panel" style="grid-column: 1/2">
		{#each $available as building}
			<Building data={building} />
		{/each}
	</div>

	<div class="panel" style="grid-column: 2/2">
		{#each $built as building}
			<Building data={building} />
		{/each}
	</div>
</div>
