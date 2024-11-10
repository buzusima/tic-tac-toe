import { v4 as uuidv4 } from "uuid"
import type { Game, GameDataProvider } from "../data-provider"
import { PlayerType } from "../../services/game.svelte"

const GAMES_KEY = "games"

const getGames = () => localStorage.getItem(GAMES_KEY)

const setGames = (games: Game[]) =>
	localStorage.setItem(GAMES_KEY, JSON.stringify(games))

const findAllGames = (): Game[] => {
	const gamesJson = getGames()

	if (gamesJson) return JSON.parse(gamesJson)

	return []
}

const findGameByGameOwnerId = (
	games: Game[],
	ownerId: string
): Game | undefined => games.find((game) => game.ownerId == ownerId)

const findGameIndexById = (games: Game[], id: string): number =>
	games.findIndex((game) => game.id == id)

const addGameOwnerPoint = (games: Game[], gameIndex: number): Game => {
	games[gameIndex].ownerNumberOfConsecutiveWins += 1
	games[gameIndex].ownerPoint += 1

	if (games[gameIndex].ownerNumberOfConsecutiveWins >= 3) {
		games[gameIndex].ownerNumberOfConsecutiveWins = 0
		games[gameIndex].ownerPoint += 1
	}

	setGames(games)

	return games[gameIndex]
}

const minusGameOwnerPoint = (games: Game[], gameIndex: number): Game => {
	if (games[gameIndex].ownerPoint > 0) games[gameIndex].ownerPoint -= 1

	setGames(games)

	return games[gameIndex]
}

const resetGameOwnerNumberOfConsecutiveWins = (
	games: Game[],
	gameIndex: number
): Game => {
	games[gameIndex].ownerNumberOfConsecutiveWins = 0

	setGames(games)

	return games[gameIndex]
}

const addChallengerPoint = (games: Game[], gameIndex: number): Game[] => {
	games[gameIndex].challengerPoint += 1
	games[gameIndex].ownerNumberOfConsecutiveWins = 0

	setGames(games)

	return games
}

export const localGameConnector: GameDataProvider = {
	getGameByGameOwnerId: (ownerId: string): Promise<Game> => {
		const games = findAllGames()
		if (!games) return Promise.reject("Game not found")

		const game = findGameByGameOwnerId(games, ownerId)

		if (game) return Promise.resolve(game)
		else return Promise.reject("Game not found")
	},

	createGameByGameOwnerId: (ownerId: string): Promise<Game> => {
		let games = findAllGames()
		if (!games) games = []

		const newGame: Game = {
			id: uuidv4(),
			ownerId: ownerId,
			ownerPoint: 0,
			ownerNumberOfConsecutiveWins: 0,
			challengerPoint: 0,
		}

		games.push(newGame)

		setGames(games)

		return Promise.resolve(newGame)
	},

	processWinner: (
		gameId: string,
		winner: PlayerType | null
	): Promise<Game> => {
		let games = findAllGames()
		if (!games) Promise.reject("Game not found")

		const gameIndex = findGameIndexById(games, gameId)
		if (gameIndex == -1) Promise.reject("Game not found")

		if (winner) {
			if (winner === PlayerType.OWNER) {
				return Promise.resolve(addGameOwnerPoint(games, gameIndex))
			} else if (winner === PlayerType.CHALLENGER) {
				games = addChallengerPoint(games, gameIndex)
				return Promise.resolve(minusGameOwnerPoint(games, gameIndex))
			} else {
				throw "Unknown PlayerType"
			}
		} else {
			return Promise.resolve(
				resetGameOwnerNumberOfConsecutiveWins(games, gameIndex)
			)
		}
	},
}
