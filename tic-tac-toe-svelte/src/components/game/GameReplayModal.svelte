<script lang="ts">
	import { createEventDispatcher, onMount } from "svelte"
	import type { Mark, Round } from "../../datasources/data-provider"
	import { getRoundMarks, MarkerType } from "../../services/game.svelte"
	import { fade } from "svelte/transition"
	import {
		generateBoard,
		generateWinningCombinations,
	} from "../../services/board.svelte"

	let {
		round,
		showModal = $bindable(),
	}: {
		round: Round
		showModal: boolean
	} = $props()

	let dialog = $state<HTMLDialogElement>()
	let getRoundMarksFunction = $state<Promise<Mark[]>>()

	let gameBoard = $state<MarkerType[][]>()
	let winnerMarkerType = $state<MarkerType>()
	let winnerCombination = $state<number[][]>()
	let winningCombinations = $state<number[][][]>()

	const dispatch = createEventDispatcher()

	$effect(() => {
		if (showModal) dialog?.showModal()
	})

	const checkWinner = (
		board: MarkerType[][],
		currentMarkerType: MarkerType
	): MarkerType | undefined => {
		winnerCombination = winningCombinations!!.find((combination) =>
			combination.every(([x, y]) => board[x][y] === currentMarkerType)
		)
		return winnerCombination ? currentMarkerType : undefined
	}

	const drawMark = async () => {
		const roundMarks = await getRoundMarks(round.id)

		for (let mark of roundMarks) {
			await new Promise((f) => setTimeout(f, 500))
			gameBoard!![mark.rowIndex][mark.colIndex] = mark.markerType
			checkWinner(gameBoard!!, mark.markerType)
		}
	}

	const doReplay = () => {
		gameBoard = generateBoard(round.gameSize)
		winningCombinations = generateWinningCombinations(round.gameSize)

		drawMark()
	}

	onMount(doReplay)
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<dialog
	bind:this={dialog}
	onclose={() => {
		showModal = false
		dispatch("close")
	}}
	onclick={(e) => {
		if (e.target === dialog) dialog.close()
	}}
>
	<div>
		<div class="header">
			<h3>Replay</h3>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				onclick={(e) => {
					showModal = false
					dispatch("close")
				}}
			>
				X
			</div>
		</div>

		{#if gameBoard}
			<div class="game-board" in:fade>
				{#each gameBoard as row, rowIndex}
					<div class="row">
						{#each row as cell, colIndex}
							<button
								class="cell {winnerCombination &&
								winnerCombination.some((element) => {
									const row = element[0]
									const col = element[1]
									return row == rowIndex && col == colIndex
								})
									? winnerMarkerType === MarkerType.X
										? 'owner-win'
										: 'challenger-win'
									: ''}"
								type="button"
							>
								{#key cell}
									<span transition:fade={{ duration: 200 }}>{cell}</span>
								{/key}
							</button>
						{/each}
					</div>
				{/each}
			</div>

			<div class="play-agian-button-container">
				<button onclick={doReplay}>Play Again</button>
			</div>
		{/if}
	</div>
</dialog>

<style>
	dialog {
		padding: 0rem 3rem 2rem 3rem;
		border-radius: 0.375rem;
		border: none;

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.game-board {
			display: grid;
			gap: 0.313rem;
			margin: auto;

			> .row {
				display: flex;
				gap: 0.313rem;
			}

			.cell {
				width: 3.125rem;
				height: 3.125rem;

				&.owner-win {
					color: lightgreen;
				}
				&.challenger-win {
					color: lightcoral;
				}
			}
		}
		.play-agian-button-container {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 1rem;
		}
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
