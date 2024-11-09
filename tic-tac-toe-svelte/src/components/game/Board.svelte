<script lang="ts">
	import { createEventDispatcher } from "svelte"
	import { fade } from "svelte/transition"
	import { getBot, type Bot } from "../../bots/bot"
	import { ChallengerType, type Round } from "../../datasources/data-provider"
	import {
		createRound,
		createRoundMark,
		MarkerType,
		PlayerType,
		type GameSettingResponse,
	} from "../../services/game.svelte"
	import {
		generateBoard,
		generateWinningCombinations,
	} from "../../services/board.svelte"

	let {
		gameId,
		gameSetting = $bindable(),
	}: {
		gameId: string
		gameSetting: GameSettingResponse
	} = $props()

	const dispatch = createEventDispatcher()

	let winningCombinations: number[][][]

	let gameBoard = $state<MarkerType[][]>()
	let gameFreezed = $state<boolean>(false)
	let winnerMarkerType = $state<MarkerType>()
	let winnerCombination = $state<number[][]>()
	let currentMarkerType = $state<MarkerType>(MarkerType.X)
	let currentRound = $state<Round>()

	let bot = $state<Bot>()

	$effect(() => {
		if (gameSetting) initBoard()
	})

	export const initBoard = async () => {
		gameBoard = generateBoard(gameSetting.gameSize)
		winningCombinations = generateWinningCombinations(gameSetting.gameSize)
		bot = getBot(gameSetting.botLevel)
		gameFreezed = false
		winnerMarkerType = undefined
		winnerCombination = undefined
		currentMarkerType = MarkerType.X

		currentRound = await createRound(gameId, gameSetting.gameSize)

		dispatch("created", currentRound)
	}

	const checkWinner = (
		board: MarkerType[][],
		currentMarkerType: MarkerType
	): MarkerType | undefined => {
		winnerCombination = winningCombinations.find((combination) =>
			combination.every(([x, y]) => board[x][y] === currentMarkerType)
		)
		return winnerCombination ? currentMarkerType : undefined
	}

	const isDraw = (board: MarkerType[][]): boolean =>
		board.every((row) => row.every((cell) => cell !== MarkerType.EMPTY))

	const switchMarker = (playerType: MarkerType) =>
		playerType == MarkerType.X ? MarkerType.O : MarkerType.X

	const challengerTurn = async (board: MarkerType[][]) => {
		if (gameSetting.challengerType === ChallengerType.BOT) botTurn(board)
	}

	const botTurn = async (board: MarkerType[][]) => {
		gameFreezed = true
		await new Promise((f) => setTimeout(f, 500)) // Bot think
		gameFreezed = false

		const [rowIndex, colIndex] = bot!!.selectCell(board, winningCombinations)
		gameBoard!![rowIndex][colIndex] = currentMarkerType

		processAfterCellClick(rowIndex, colIndex)
	}

	const handleOnCellClick = (rowIndex: number, colIndex: number) => {
		if (
			gameBoard &&
			gameBoard[rowIndex][colIndex] === MarkerType.EMPTY &&
			!gameFreezed
		) {
			gameBoard[rowIndex][colIndex] = currentMarkerType

			processAfterCellClick(rowIndex, colIndex)
		}
	}

	const processAfterCellClick = async (rowIndex: number, colIndex: number) => {
		createRoundMark(currentRound!!.id, rowIndex, colIndex, currentMarkerType)
		winnerMarkerType = checkWinner(gameBoard!!, currentMarkerType)

		if (winnerMarkerType) {
			gameFreezed = true
			dispatch(
				"gameEnd",
				winnerMarkerType === MarkerType.X
					? PlayerType.OWNER
					: PlayerType.CHALLENGER
			)
		} else {
			const draw = isDraw(gameBoard!!)
			if (draw) {
				gameFreezed = true
				dispatch("gameEnd")
			} else {
				currentMarkerType = switchMarker(currentMarkerType)
				if (currentMarkerType === MarkerType.O) challengerTurn(gameBoard!!)
			}
		}
	}
</script>

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
						onclick={() => handleOnCellClick(rowIndex, colIndex)}
					>
						{#key cell}
							<span transition:fade={{ duration: 200 }}>{cell}</span>
						{/key}
					</button>
				{/each}
			</div>
		{/each}
	</div>
{/if}

<style>
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
</style>
