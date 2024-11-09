<script lang="ts">
	import { onMount } from "svelte"
	import { getRounds, PlayerType } from "../../services/game.svelte"
	import type { Round } from "../../datasources/data-provider"

	let { gameId }: { gameId: string } = $props()

	export const reload = () => {
		getRoundsFunction = getRounds(gameId)
	}

	let getRoundsFunction = $state<Promise<Round[]>>()

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
							<button>Replay</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
{/await}

<style>
</style>
