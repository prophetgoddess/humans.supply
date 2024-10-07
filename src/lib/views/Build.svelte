<script lang="ts">
	import Building from '$lib/views/Building.svelte';
	import { world } from '$lib/EntityStorage';
	import { Facility, Money, Name, Upgrade } from '$lib/Components';

	let upgradePrice = 1000;

	$: upgradeLevel = (
		$world
			.find((e) => e.components.find((c) => c.id === 'Upgrade'))
			?.components.find((c) => c.id === 'Upgrade') as Upgrade
	).value;

	$: available = $world.filter((e) => {
		let result = e.components.find((c) => c.id == 'Facility');
		if (result !== undefined) {
			let building = result as Facility;
			return building.unlocked && !building.purchased;
		}

		return false;
	});

	function upgrade() {
		let moneyEntity = $world.find((e) => e.components.find((c) => c.id === 'Money'));
		if (moneyEntity !== undefined) {
			let moneyComponent = moneyEntity?.components.find((c) => c.id === 'Money') as Money;
			let newValue = moneyComponent.value - upgradePrice;
			if (newValue < 0) {
				return false;
			} else {
				world.setComponent(moneyEntity, new Money(newValue));

				let singleton = $world.find((e) => e.components.find((c) => c.id === 'Upgrade'));
				if (singleton !== undefined) {
					world.setComponent(singleton, new Upgrade(upgradeLevel * 2));
					upgradePrice *= 2;
				}

				return true;
			}
		}
	}

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
	<div class="panel" style="flex-direction: column; width: 50%; overflow: auto;">
		<h3>Available Facilities</h3>
		{#each available as building (building.id)}
			<Building entity={building} />
		{/each}
	</div>

	<div class="panel" style="flex-direction: column; width: 50%; overflow: auto;">
		<button on:click={upgrade}>Upgrade Capacity: ${upgradePrice} (current: {upgradeLevel}x)</button>

		{#each built as building (building.id)}
			<Building entity={building} />
		{/each}
	</div>
</div>
