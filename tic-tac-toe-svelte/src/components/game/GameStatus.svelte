<script lang="ts">
	import { onMount } from "svelte"
	import { fade } from "svelte/transition"
	import {
		MarkerType,
		PlayerType,
		type GameResponse,
		type GameSettingResponse,
	} from "../../services/game.svelte"
	import { ChallengerType } from "../../datasources/data-provider"

	let {
		gameSetting = $bindable(),
		game = $bindable(),
		winner = $bindable(),
	}: {
		gameSetting: GameSettingResponse
		game: GameResponse
		winner: PlayerType | undefined
	} = $props()

	onMount(() => {})
</script>

<div class="player-status-container">
	You - {MarkerType.X}
	<div
		class="player-point-container {winner === PlayerType.OWNER ? 'win' : ''}"
	>
		{#key game.ownerPoint}
			Point: <span in:fade={{ duration: 1000 }}>{game.ownerPoint}</span>
		{/key}

		<div class="consecutive-container">
			Consecutive Wins:
			{#each { length: game.ownerNumberOfConsecutiveWins } as _, i}
				<div class="consecutive-current" in:fade></div>
			{/each}

			{#if gameSetting}
				{#each { length: gameSetting.consecutiveTarget - game.ownerNumberOfConsecutiveWins } as _, i}
					<div class="consecutive-target"></div>
				{/each}
			{/if}
		</div>
	</div>
</div>
<div class="bot-status-container">
	<span>
		Challenger - {MarkerType.O} ({gameSetting.challengerType ===
		ChallengerType.PLAYER
			? "Player"
			: "BOT"})
	</span>
	<div
		class="bot-point-container {winner === PlayerType.CHALLENGER ? 'win' : ''}"
	>
		Point: {game.challengerPoint}
	</div>
</div>

<style>
	.player-status-container {
		color: lightgreen;

		.player-point-container {
			border: 0.125rem solid gray;
			border-radius: 0.375rem;
			padding: 0.313rem 5rem 0.313rem 1rem;
			&.win {
				border: 0.125rem solid lightgreen;
			}
		}

		.consecutive-container {
			display: flex;
			gap: 0.5rem;
			align-items: center;
			justify-content: center;

			.consecutive-current {
				width: 0.5rem;
				height: 1rem;
				background-color: aqua;
				border: 0.125rem solid aqua;
				border-radius: 0.375rem;
			}
			.consecutive-target {
				width: 0.5rem;
				height: 1rem;
				border: 0.125rem solid aqua;
				border-radius: 0.375rem;
			}
		}
	}

	.bot-status-container {
		margin-top: 0.625rem;
		color: lightcoral;

		.bot-point-container {
			border: 0.125rem solid gray;
			border-radius: 0.375rem;
			padding: 0.313rem 5rem 0.313rem 1rem;
			&.win {
				border: 0.125rem solid lightcoral;
			}
		}
	}
</style>
