<script lang="ts">
	import {
		Human,
		Name,
		Obedient,
		Rude,
		Rudeness,
		Working,
		type Facility,
		type Money
	} from '$lib/Components';
	import { names } from '$lib/data/Names';
	import { Entity, world } from '$lib/EntityStorage';
	import { tick } from '$lib/Time';

	export let entity: Entity;

	const rudeConstant: number = 0.01;

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

	$: rudeness = (
		$world
			.find((e) => e.components.find((c) => c.id === 'Rudeness'))
			?.components.find((c) => c.id === 'Rudeness') as Rudeness
	).value;

	function build() {
		if (changeMoney(-data.cost)) {
			let newBuilding = world.copyEntity(entity);
			let newData = Object.create(data);
			newData.purchased = true;
			world.setComponent(newBuilding, newData);
		}
	}

	function assignHuman() {
		if (data.capacity <= users.length) {
			return;
		}

		let human = humans.find(
			(h) =>
				h.components.find((c) => c.id === 'Working') === undefined &&
				h.components.find((c) => c.id === 'Rude') === undefined &&
				!(
					h.components.find((c) => c.id === 'Obedient') &&
					entity.components.find((c) => c.id === 'SolitaryConfinement')
				)
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
		if (human !== undefined) {
			if (human.components.find((c) => c.id === 'Obedient')) {
				return;
			}

			users = users.filter((e) => e.id !== human.id);
			world.removeComponent(human, 'Working');
			world.setComponent(human, new Rude());
		}
	}

	function makeObedient(human: Entity) {
		if (human !== undefined) {
			if (human.components.find((c) => c.id === 'Rude')) {
				return;
			}

			users = users.filter((e) => e.id !== human.id);
			world.removeComponent(human, 'Working');
			world.setComponent(human, new Obedient());
		}
	}

	function changeMoney(amount: number) {
		let moneyEntity = $world.find((e) => e.components.find((c) => c.id === 'Money'));
		if (moneyEntity !== undefined) {
			let moneyComponent = moneyEntity?.components.find((c) => c.id === 'Money') as Money;
			moneyComponent.value += amount;
			if (moneyComponent.value < 0) {
				return false;
			} else {
				world.setComponent(moneyEntity, moneyComponent);
				return true;
			}
		}
		return false;
	}

	tick.subscribe((value) => {
		if (data !== undefined && data.purchased) {
			if (
				entity.components.find((c) => c.id === names.ReproductionChamber.singular) !== undefined
			) {
				for (let user of users) {
					if (Math.random() < rudeness) {
						makeRude(user);
					}
				}

				let couples = Math.floor(users.length / 2);

				for (let i = 0; i < couples; i++) {
					if (Math.random() <= 0.4) {
						if (changeMoney(-1)) {
							let h = world.createEntity();
							world.setComponent(h, new Human());
						}
					}
				}
			} else if (entity.components.find((c) => c.id === names.MeatGrinder.singular) !== undefined) {
				for (let user of users) {
					if (Math.random() < rudeness) {
						makeRude(user);
					} else if (Math.random() < 0.5) {
						users = users.filter((e) => e.id !== user.id);
						world.destroyEntity(user);
						changeMoney(10);
					}
				}
			} else if (
				entity.components.find((c) => c.id === names.SolitaryConfinement.singular) !== undefined
			) {
				for (let user of users) {
					if (Math.random() < rudeness) {
						makeRude(user);
					} else if (Math.random() < 0.2) {
						if (changeMoney(-2)) {
							makeObedient(user);
						}
					}
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
