<script lang="ts">
	import Event from './Event.svelte';
	import { world } from '$lib/EntityStorage';
	import { Event as EventComponent } from '$lib/Components';

	import { tick } from '$lib/Time';

	$: events = $world.filter((e) => e.components.find((c) => c.id === 'Event')).reverse();
</script>

<div
	style="	border-style: solid;
			margin: 1em;
			padding: 0.25em;
            max-height: 150px;
            min-height: 20%;
            height: 20%;

            overflow: auto;"
>
	{#each events as event, i}
		<Event entity={event} />
		{#if events.length > 1}
			<hr />
		{/if}
	{/each}
</div>
