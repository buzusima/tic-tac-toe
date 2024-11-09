<script lang="ts">
	import { onMount } from "svelte"
	import Board from "../components/game/Board.svelte"
	import GameHistory from "../components/game/GameHistory.svelte"
	import GameSettings from "../components/game/GameSettings.svelte"
	import GameStatus from "../components/game/GameStatus.svelte"
	import { type Round } from "../datasources/data-provider"
	import {
		DEFAULT_OWNER_PROFILE,
		gameOwnerProfile,
		logout,
	} from "../services/game-owner.svelte"
	import {
		getGame,
		getGameSetting,
		PlayerType,
		processPoint,
		setRoundWinner,
		type GameResponse,
		type GameSettingResponse,
	} from "../services/game.svelte"

	let board = $state<Board>()
	let gameHistory = $state<GameHistory>()

	let gameEnd = false
	let winner = $state<PlayerType>()

	let getGameSettingFunction = $state<Promise<GameSettingResponse>>()
	let getGameFunction = $state<Promise<GameResponse>>()

	let gameSetting = $state<GameSettingResponse>()
	let game = $state<GameResponse>()
	let currentRound = $state<Round>()

	const handleOnGameEnd = async (event: any) => {
		gameEnd = true
		winner = event.detail as PlayerType

		const giveBonusPoint =
			winner === PlayerType.OWNER &&
			game!!.ownerNumberOfConsecutiveWins + 1 == gameSetting!!.consecutiveTarget

		await setRoundWinner(currentRound!!.id, winner)
		game = await processPoint(game!!.id, winner)

		alertAndResetBoard(game!!, giveBonusPoint)
	}

	const alertAndResetBoard = (game: GameResponse, giveBonusPoint: boolean) => {
		if (winner === PlayerType.OWNER) {
			alertAndInitBoard(
				giveBonusPoint
					? "Congraturation!, you got 1 bonus point, so the point has been +2 ^^"
					: "You win!, the point has been +1"
			)
		} else if (winner === PlayerType.CHALLENGER) {
			alertAndInitBoard(
				game.ownerPoint > 0 ? "You lose!, the point has been -1" : "You lose!"
			)
		} else {
			alertAndInitBoard("Draw!")
		}

		board?.initBoard()
		gameHistory?.reload()
		winner = undefined
	}

	const alertAndInitBoard = async (message: string) => {
		await new Promise((f) => setTimeout(f, 250))
		alert(message)
	}

	const handleOnBoardCreated = (event: any) => {
		currentRound = event.detail as Round
	}

	$effect(() => {
		if ($gameOwnerProfile) {
			getGameFunction = getGame($gameOwnerProfile.reference)
			getGameSettingFunction = getGameSetting($gameOwnerProfile.reference)
		}
	})

	onMount(async () => {
		try {
			gameSetting = await getGameSettingFunction
			game = await getGameFunction
		} catch (error) {
			console.error(error)
		}
	})
</script>

{#if $gameOwnerProfile && $gameOwnerProfile.reference !== DEFAULT_OWNER_PROFILE.reference}
	<div class="header-container">
		<span class="player-profile-container">{$gameOwnerProfile.name}</span>
		<button type="button" class="logout-button" onclick={logout}>
			<span class="material-symbols-outlined"> logout </span>
			<span class="logout-text">Logout</span>
		</button>
	</div>
{/if}
<div class="game-panel-container">
	{#await getGameFunction then}
		{#await getGameSettingFunction then}
			{#if game && gameSetting}
				<div class="game-panel">
					<div>
						<div class="setting-contianer">
							<GameSettings bind:gameSetting />
						</div>
						<GameStatus bind:gameSetting bind:game bind:winner />
					</div>
					<div class="board-container">
						<Board
							bind:this={board}
							gameId={game.id}
							bind:gameSetting
							on:created={handleOnBoardCreated}
							on:gameEnd={handleOnGameEnd}
						/>
					</div>
					<div class="board-container">
						<GameHistory bind:this={gameHistory} gameId={game.id} />
					</div>
				</div>
			{/if}
		{/await}
	{/await}
</div>

<style>
	.header-container {
		display: flex;
		justify-content: end;
		align-items: center;

		.logout-button {
			margin-left: 0.5rem;
			display: flex;
			gap: 0.2rem;
			align-items: center;

			.logout-text {
				display: inline;
			}

			@media (max-width: 600px) {
				.logout-text {
					display: none;
				}
			}
		}
	}

	.game-panel-container {
		height: 80vh;
		display: grid;
		place-items: center;

		.game-panel {
			display: flex;
			flex-direction: column;
			align-items: center;

			.setting-contianer {
				display: flex;
				justify-content: end;
				margin-top: 0.625rem;
			}

			.board-container {
				margin-top: 3rem;
				/* height: 15rem;
                width: 15rem;
                display: flex; */
			}
		}
	}
</style>
