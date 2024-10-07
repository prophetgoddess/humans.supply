<script lang="ts">
	import Event from './Event.svelte';
	import { world } from '$lib/EntityStorage';

	$: events = $world.filter((e) => e.components.find((c) => c.id === 'Event')).reverse();
</script>

<div
	style="	border-style: solid;
			margin: 1em;
			padding: 0.25em;
            max-height: 150px;

            overflow: auto;"
>
	{#each events as event, i}
		<Event entity={event} />
		{#if events.length > 1}
			<hr />
		{/if}
	{/each}
</div>
