import { v4 as uuidv4 } from "uuid"
import type { PlayerType } from "../../services/game.svelte"
import type { Round, RoundDataProvider } from "../data-provider"

const ROUNDS_KEY = "rounds"

const getGameRounds = () => localStorage.getItem(ROUNDS_KEY)

const setGameRounds = (games: Round[]) =>
	localStorage.setItem(ROUNDS_KEY, JSON.stringify(games))

const findAllGameRounds = (): Round[] => {
	const gameRounesJson = getGameRounds()

	if (gameRounesJson) return JSON.parse(gameRounesJson)

	return []
}

const findGameRoundsByGameId = (gameRounds: Round[], gameId: string): Round[] =>
	gameRounds.filter(
		(round) => round.gameId == gameId && round.winner !== undefined
	)

const findGameRoundIndexById = (gameRounds: Round[], roundId: string): number =>
	gameRounds.findIndex((gameRound) => gameRound.id == roundId)

export const localGameRoundConnector: RoundDataProvider = {
	getRoundsByGameId: (gameId: string): Promise<Round[]> => {
		const gameRounds = findAllGameRounds()
		const gameRoundsOfId = findGameRoundsByGameId(gameRounds, gameId)

		return Promise.resolve(gameRoundsOfId)
	},

	createRoundByGameId: (gameId: string, gameSize: number): Promise<Round> => {
		const gameRounds = findAllGameRounds()

		const newGameRoumd: Round = {
			id: uuidv4(),
			gameId: gameId,
			gameSize: gameSize,
			winner: undefined,
			gameEnd: false,
		}

		gameRounds.push(newGameRoumd)

		setGameRounds(gameRounds)

		return Promise.resolve(newGameRoumd)
	},

	setWinnerByRoundId: (roundId: string, winner: PlayerType): Promise<Round> => {
		const gameRounds = findAllGameRounds()
		if (!gameRounds) Promise.reject("Game round not found")

		const roundIndex = findGameRoundIndexById(gameRounds, roundId)

		if (roundIndex == -1)
			return Promise.reject(new Error("Game round not found"))

		gameRounds[roundIndex].winner = winner
		gameRounds[roundIndex].gameEnd = true

		setGameRounds(gameRounds)

		return Promise.resolve(gameRounds[roundIndex])
	},
}
