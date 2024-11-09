<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte"
	import type { Mark } from "../../datasources/data-provider"
	import { getRoundMarks } from "../../services/game.svelte"

	let {
		roundId,
		showModal = $bindable(),
	}: {
		roundId: string
		showModal: boolean
	} = $props()

	let dialog = $state<HTMLDialogElement>()
	let getRoundMarksFunction = $state<Promise<Mark[]>>()

	const dispatch = createEventDispatcher()

	$effect(() => {
		if (showModal) dialog?.showModal()
	})

	onMount(() => {
		getRoundMarksFunction = getRoundMarks(roundId)
	})
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<dialog
	bind:this={dialog}
	on:close={() => {
		showModal = false
		dispatch("close")
	}}
	on:click={(e) => {
		if (e.target === dialog) dialog.close()
	}}
>
	<div>
		<h3>Replay</h3>

		{#await getRoundMarksFunction}
			Loading...
		{:then marks}
			{#if marks}
				<table>
					<thead>
						<tr>
							<th>Mark</th>
							<th>X</th>
							<th>Y</th>
							<th>Marker Type</th>
						</tr>
					</thead>
					<tbody>
						{#each marks.reverse() as mark, index}
							<tr>
								<td>
									{marks.length - index}
								</td>
								<td>
									{mark.x}
								</td>
								<td>
									{mark.y}
								</td>
								<td>
									{mark.markerType}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		{/await}
	</div>
</dialog>

<style>
	dialog {
		padding: 0rem 3rem 2rem 3rem;
		border-radius: 0.375rem;
		border: none;
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
