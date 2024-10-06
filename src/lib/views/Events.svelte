<script lang="ts">
	import Event from './Event.svelte';
	import { world } from '$lib/EntityStorage';
	import { Event as EventComponent } from '$lib/Components';

	import { tick } from '$lib/Time';

	$: events = $world.filter((e) => e.components.find((c) => c.id === 'Event'));

	tick.subscribe((value) => {
		if (events !== undefined) {
			for (let event of events) {
				let eventComponent = event.components.find((c) => c.id === 'Event') as EventComponent;
				if (eventComponent != undefined) {
					var ticks = eventComponent.ticks - 1;

					if (ticks > 0) {
						world.setComponent(event, new EventComponent(eventComponent.message, ticks));
					} else {
						world.destroyEntity(event);
					}
				}
			}
		}
	});
</script>

<div>
	{#each events as event, i}
		<Event --bottom="{(i + 0.25) * 100}px" entity={event} />
	{/each}
</div>
