<script lang="ts">
	import { BuildingData, built } from '$lib/BuildingStorage';
	import { HumanData, humans } from '$lib/HumanStorage';
	import { money } from '$lib/MoneyStorage';

	export let data: BuildingData;

	let activated = true;
	let users: HumanData[] = [];

	function build() {
		if ($money >= data.cost) {
			let newBuilding = Object.create(data);
			newBuilding.purchased = true;
			$built = [...$built, newBuilding];
			money.update((n) => n - data.cost);
		}
	}

	function toggleActivation() {
		activated = !activated;
	}

	function assignHuman() {
		if (data.capacity <= users.length) {
			return;
		}
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

<div class="panel">
	<span>{data.name}</span>
	{#if data.purchased}
		<span>
			<button on:click={toggleActivation}>
				{#if activated}
					Deactivate
				{:else}
					Activate
				{/if}
			</button>
		</span>

		<span>
			Workers:
			<button on:click={freeHuman}>-</button>
			{users.length}
			{#if users.length < data.capacity}
				<button on:click={assignHuman}>+</button>
			{:else}
				(MAX)
			{/if}
		</span>
	{:else}
		${data.cost}
		<button on:click={build}>Build</button>
	{/if}
</div>
