<script lang="ts">
	import Building from '$lib/buildings/Building.svelte';
	import { built, available } from '$lib/BuildingStorage';
</script>

<div class="panel">
	<h2>Buildings</h2>

	<div class="panel" style="grid-column: 1/2">
		<h3>Available Buildings</h3>
		{#each $available as building}
			<Building data={building} />
		{/each}
	</div>

	<div class="panel" style="grid-column: 2/2">
		<h3>Finished Buildings</h3>
		{#each $built as building}
			<Building data={building} />
		{/each}
	</div>
</div>
