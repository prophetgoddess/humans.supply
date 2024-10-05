<script lang="ts">
	import { BuildingData, built } from '$lib/BuildingStorage';

	export let data: BuildingData;

	export function build() {
		let newBuilding = structuredClone(data);
		newBuilding.purchased = true;
		$built = [...$built, newBuilding];
	}
</script>

<div>
	{data.name}
	{#if data.purchased}
		<slot {data} />
	{:else}
		<button on:click={build}>Build</button>
	{/if}
</div>
