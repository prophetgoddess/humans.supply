<script lang="ts">
	import { BuildingData, built } from '$lib/BuildingStorage';
	import { HumanData, humans } from '$lib/HumanStorage';

	export let data: BuildingData;

	let activated = true;
	let users: HumanData[] = [];

	function build() {
		let newBuilding = Object.create(data);
		newBuilding.purchased = true;
		data = newBuilding;
		$built = [...$built, newBuilding];
	}

	function toggleActivation() {
		activated = !activated;
	}

	function assignHuman() {
		let human = $humans.find((h) => h.available);
		if (human !== undefined) {
			users = [...users, human];
			humans.toggleAvailable(human.id);
		}
	}

	function freeHuman() {
		let human = users.pop();
		users = users;

		if (human !== undefined) {
			humans.toggleAvailable(human.id);
		}
	}

	setInterval(() => {
		data.tick(users);
	}, 1000);
</script>

<div>
	{data.name}
	{#if data.purchased}
		<button on:click={toggleActivation}>
			{#if activated}
				Deactivate
			{:else}
				Activate
			{/if}
		</button>

		<span
			>Users:
			<button on:click={freeHuman}>-</button>
			{users.length}
			<button on:click={assignHuman}>+</button>
		</span>
	{:else}
		<button on:click={build}>Build</button>
	{/if}
</div>
