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

<style>
	/* The Modal (background) */
	.modal {
		display: block;
		position: absolute;
		z-index: 1;
		right: 0;
		bottom: var(--bottom, 0px);
		width: 50%;
	}

	/* Modal Content/Box */
	.modal-content {
		background-color: #ffffff;
		padding: 20px;
		border: solid;
	}
</style>
