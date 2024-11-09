// import { v4 as uuidv4 } from "uuid"
// import type { Game, GameDataProvider, Mark, MarkDataProvider } from "../data-provider"

// const GAMES_KEY = "games"

// const getGameTurns = () => localStorage.getItem(GAMES_KEY)

// const setGameTurns = (games: Game[]) =>
//   localStorage.setItem(GAMES_KEY, JSON.stringify(games))


// const findAllGameTurns = (): Game[] => {
//   const gamesJson = getGameTurns()

//   if (gamesJson) return JSON.parse(gamesJson)

//   return []
// }

// const findGameTurnByGameOwnerId = (games: Game[], ownerId: string): Game =>
//   games.find((game) => game.ownerId == ownerId)

// export const localGameMarkConnector: MarkDataProvider = {
// 	getMarksByRoundId: function (roundId: string): Promise<Mark[]> {
// 		const gameRoundsJson = getGameRounds()

// 		let gameRounds: Mark[] | undefined
// 		if (gameRoundsJson) gameRounds = JSON.parse(gameRoundsJson)
// 		if (!gameRounds) return Promise.reject(new Error("Game round not found"))

// 		return Promise.resolve(findGameRoundsByGameId(gameRounds, gameId))
// 	},
// 	createRound: function (gameId: string): Promise<Round> {
// 		throw new Error("Function not implemented.")
// 	},
// }