<script lang="ts">
	import { Human, Name, Obedient, Rude, Working, type Facility, type Money } from '$lib/Components';
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

	$: data = entity.components.find((c) => c.id === 'Facility') as Facility;

	$: name = (entity.components.find((c) => c.id === 'Name') as Name).value;

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

		let human = humans.find(
			(h) =>
				h.components.find((c) => c.id === 'Working') === undefined &&
				h.components.find((c) => c.id === 'Rude') === undefined
		);
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

	function makeRude(human: Entity) {
		users = users.filter((e) => e.id !== human.id);

		if (human !== undefined) {
			world.setComponent(human, new Rude());
		}
	}

	function makeObedient(human: Entity) {
		users = users.filter((e) => e.id !== human.id);

		if (human !== undefined) {
			world.setComponent(human, new Obedient());
		}
	}

	tick.subscribe((value) => {
		if (data !== undefined && data.purchased) {
			if (
				entity.components.find((c) => c.id === names.ReproductionChamber.singular) !== undefined
			) {
				for (let user of users) {
					if (user.components.find((c) => c.id !== 'Obedient')) {
						if (Math.random() < 0.01) {
							makeRude(user);
						}
					}
				}

				let couples = Math.floor(users.length / 2);

				for (let i = 0; i < couples; i++) {
					if (Math.random() <= 0.2) {
						let h = world.createEntity();
						world.setComponent(h, new Human());
					}
				}
			} else if (entity.components.find((c) => c.id === names.MeatGrinder.singular) !== undefined) {
				for (let user of users) {
					if (Math.random() < 0.2) {
						users = users.filter((e) => e.id == user.id);
						world.destroyEntity(user);

						let moneyEntity = $world.find((e) => e.components.find((c) => c.id === 'Money'));
						if (moneyEntity !== undefined) {
							let moneyComponent = moneyEntity?.components.find((c) => c.id === 'Money') as Money;
							moneyComponent.value += 10;
							world.setComponent(moneyEntity, moneyComponent);
						}
					}
				}
			} else if (
				entity.components.find((c) => c.id === names.SolitaryConfinement.singular) !== undefined
			) {
				for (let user of users) {
					if (Math.random() < 0.2) {
						users = users.filter((e) => e.id == user.id);
						makeObedient(user);
					} else if (Math.random() < 0.01) {
						makeRude(user);
					}
				}

				let human = humans.find(
					(h) =>
						h.components.find((c) => c.id === 'Working') === undefined &&
						h.components.find((c) => c.id === 'Rude') === undefined &&
						h.components.find((c) => c.id === 'Obedient') === undefined
				);
				if (human !== undefined) {
					users = [...users, human];
					world.setComponent(human, new Working());
				}
			}
		}
	});
</script>

<div class="panel">
	<span>{name}</span>
	{#if data.purchased}
		<span>
			Humans:
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
