<script lang="ts">
	import { Human, Working, type Facility, type Money } from '$lib/Components';
	import { names } from '$lib/data/Names';
	import { Entity, world } from '$lib/EntityStorage';
	import { tick } from '$lib/Time';

	export let entity: Entity;

	let users: Entity[] = [];

	$: money = $world.reduce((total, e) => {
		let component = e.components.find((c) => c.id == 'Money');

		if (component !== undefined) {
			return (component as Money).value;
		}

		return total;
	}, 0);

	$: humans = $world.filter((e) => e.components.find((c) => c.id === 'Human') !== undefined);

	$: data = entity.components.find((c) => c.id == 'Facility') as Facility;

	function build() {
		if (money >= data.cost) {
			let newBuilding = world.copyEntity(entity);
			let newData = Object.create(data);
			newData.purchased = true;
			world.setComponent(newBuilding, newData);
			let moneyEntity = $world.find((e) => e.components.find((c) => c.id === 'Money'));
			if (moneyEntity !== undefined) {
				let moneyComponent = moneyEntity?.components.find((c) => c.id === 'Money') as Money;
				moneyComponent.value -= data.cost;
				world.setComponent(moneyEntity, moneyComponent);
			}
		}
	}

	function assignHuman() {
		if (data.capacity <= users.length) {
			return;
		}

		let human = humans.find((h) => h.components.find((c) => c.id === 'Working') === undefined);
		if (human !== undefined) {
			users = [...users, human];
			world.setComponent(human, new Working());
		}
	}

	function freeHuman() {
		let human = users.pop();
		users = users;

		if (human !== undefined) {
			world.removeComponent(human, 'Working');
		}
	}

	function getFacilityName() {
		for (let component of entity.components) {
			for (const [k, v] of Object.entries(names)) {
				if (v.singular === component.id) {
					return v.singular;
				}
			}
		}
		return data.id;
	}

	tick.subscribe((value) => {
		if (data !== undefined && data.purchased) {
			if (
				entity.components.find((c) => c.id === names.ReproductionChamber.singular) !== undefined
			) {
				let couples = Math.floor(users.length / 2);

				for (let i = 0; i < couples; i++) {
					if (Math.random() <= 0.2) {
						let h = world.createEntity();
						world.setComponent(h, new Human());
					}
				}
			}
		}
	});
</script>

<div class="panel">
	<span>{getFacilityName()}</span>
	{#if data.purchased}
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
