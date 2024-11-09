<script lang="ts">
	import { onMount } from "svelte"
	import type { Round } from "../../datasources/data-provider"
	import { getRounds, PlayerType } from "../../services/game.svelte"
	import GameReplayModal from "./GameReplayModal.svelte"

	let { gameId }: { gameId: string } = $props()

	export const reload = () => {
		getRoundsFunction = getRounds(gameId)
	}

	let getRoundsFunction = $state<Promise<Round[]>>()
	let diplayingRound = $state<Round>()
	let showModal = $state<boolean>(false)

	const openReplayModal = (round: Round) => {
		diplayingRound = round
		showModal = true
	}

	const handleOnModalClose = () => {
		diplayingRound = undefined
		showModal = false
	}

	onMount(() => {
		getRoundsFunction = getRounds(gameId)
	})
</script>

<h3>History</h3>

{#await getRoundsFunction}
	Loading...
{:then rounds}
	{#if rounds}
		<table>
			<thead>
				<tr>
					<th>Round</th>
					<th>Winner</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
				{#each rounds.reverse() as round, index}
					<tr>
						<td>
							{rounds.length - index}
						</td>
						<td>
							{round.winner === PlayerType.OWNER ? "You" : "Challenger"}
						</td>
						<td>
							<button onclick={() => openReplayModal(round)}>Replay</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		{#if diplayingRound}
			<GameReplayModal
				bind:showModal
				round={diplayingRound}
				on:close={handleOnModalClose}
			/>
		{/if}
	{/if}
{/await}

<style>
</style>
