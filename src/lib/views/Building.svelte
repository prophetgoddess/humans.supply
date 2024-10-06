<script lang="ts">
	import {
		Description,
		FacilityType,
		Human,
		Money,
		Name,
		Obedient,
		Rude,
		Rudeness,
		Upgrade,
		Working,
		type Facility
	} from '$lib/Components';
	import { Entity, world } from '$lib/EntityStorage';
	import { tick } from '$lib/Time';

	export let entity: Entity;

	let users: Entity[] = [];
	let currentCapacity: number = 0;

	$: humans = $world.filter((e) => e.components.find((c) => c.id === 'Human') !== undefined);

	$: data = entity.components.find((c) => c.id === 'Facility') as Facility;

	$: name = (entity.components.find((c) => c.id === 'Name') as Name).value;

	$: description = (entity.components.find((c) => c.id === 'Description') as Description).value;

	$: capacity =
		data.capacity *
		(
			$world
				.find((e) => e.components.find((c) => c.id === 'Upgrade'))
				?.components.find((c) => c.id === 'Upgrade') as Upgrade
		).value;

	$: cost =
		data.cost *
		$world.filter((e) => {
			let facility = e.components.find((c) => c.id === 'Facility') as Facility;

			if (facility !== undefined) {
				if (facility.type == data.type) {
					return true;
				}
			}

			return false;
		}).length;

	$: rudeness = (
		$world
			.find((e) => e.components.find((c) => c.id === 'Rudeness'))
			?.components.find((c) => c.id === 'Rudeness') as Rudeness
	).value;

	function build() {
		if (changeMoney(-cost)) {
			let newBuilding = world.copyEntity(entity);
			let newData = Object.create(data);
			newData.purchased = true;
			world.setComponent(newBuilding, newData);
		}
	}

	function assignHuman() {
		if (capacity <= users.length || currentCapacity <= users.length) {
			return;
		}

		let human = humans.find(
			(h) =>
				h.components.find((c) => c.id === 'Working') === undefined &&
				h.components.find((c) => c.id === 'Rude') === undefined &&
				!(
					h.components.find((c) => c.id === 'Obedient') &&
					data.type === FacilityType.SolitaryConfinement
				)
		);
		if (human !== undefined) {
			users = [...users, human];
			world.setComponent(human, new Working());
		}
	}

	function freeHuman(human: Entity) {
		if (human !== undefined) {
			users = users.filter((e) => e.id !== human.id);
			world.removeComponent(human, 'Working');
		}
	}

	function increaseCapacity() {
		currentCapacity++;
		if (currentCapacity > capacity) currentCapacity = capacity;
	}

	function decreaseCapacity() {
		currentCapacity--;
		if (currentCapacity < 0) currentCapacity = 0;
	}

	function maxCapacity() {
		currentCapacity = capacity;
	}

	function zeroCapacity() {
		currentCapacity = 0;
	}

	function makeRude(human: Entity) {
		if (human !== undefined) {
			if (human.components.find((c) => c.id === 'Obedient')) {
				return;
			}

			users = users.filter((e) => e.id !== human.id);
			freeHuman(human);
			world.setComponent(human, new Rude());
		}
	}

	function makeObedient(human: Entity) {
		if (human !== undefined) {
			if (human.components.find((c) => c.id === 'Rude')) {
				return;
			}

			users = users.filter((e) => e.id !== human.id);
			freeHuman(human);
			world.setComponent(human, new Obedient());
		}
	}

	function changeMoney(amount: number) {
		let moneyEntity = $world.find((e) => e.components.find((c) => c.id === 'Money'));
		if (moneyEntity !== undefined) {
			let moneyComponent = moneyEntity?.components.find((c) => c.id === 'Money') as Money;
			let newValue = moneyComponent.value + amount;
			if (newValue < 0) {
				return false;
			} else {
				world.setComponent(moneyEntity, new Money(newValue));
				return true;
			}
		}
		return false;
	}

	tick.subscribe((value) => {
		if (data !== undefined && data.purchased) {
			for (let i = 0; i < currentCapacity; i++) {
				assignHuman();
			}

			if (data.type === FacilityType.ReproductionChamber) {
				let couples = Math.floor(users.length / 2);

				for (let i = 0; i < couples; i++) {
					if (Math.random() < 0.5) {
						if (changeMoney(-1)) {
							let h = world.createEntity();
							world.setComponent(h, new Human());
						}
					}
				}
				for (let user of users) {
					if (Math.random() < rudeness) {
						makeRude(user);
					}
				}
			} else if (data.type === FacilityType.MeatGrinder) {
				for (let user of users) {
					if (Math.random() < 0.6) {
						freeHuman(user);
						world.destroyEntity(user);
						changeMoney(10);
					} else if (Math.random() < rudeness) {
						makeRude(user);
					}
				}
			} else if (data.type === FacilityType.SolitaryConfinement) {
				for (let user of users) {
					if (Math.random() < 0.45) {
						if (changeMoney(-2)) {
							makeObedient(user);
						}
					} else if (Math.random() < rudeness) {
						makeRude(user);
					}
				}
			}
		}
	});
</script>

<div style="border: solid; padding: 4px; margin: 2px">
	<p><b>{name}</b></p>
	{#if data.purchased}
		<p>
			Capacity:
			{#if currentCapacity > 0}
				<button on:click={zeroCapacity}>0</button>
				<button on:click={decreaseCapacity}>-</button>
			{/if}
			{currentCapacity}
			{#if currentCapacity < capacity}
				<button on:click={increaseCapacity}>+</button>
				<button on:click={maxCapacity}>MAX</button>
			{/if}
			Processing: {users.length}
		</p>
	{:else}
		<p></p>
		<p>${cost}</p>
		<p><button on:click={build}>Build</button></p>
		<p>{description}</p>
	{/if}
</div>
