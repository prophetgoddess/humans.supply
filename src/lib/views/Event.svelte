<script lang="ts">
	import type { Entity } from '$lib/EntityStorage';
	import { Event } from '$lib/Components';

	export let entity: Entity;

	$: eventComponent = entity.components.find((c) => c.id === 'Event');
	$: message = eventComponent != undefined ? (eventComponent as Event).message : '';
</script>

<div class="modal">
	<div class="modal-content">
		<p>{message}</p>
	</div>
</div>
