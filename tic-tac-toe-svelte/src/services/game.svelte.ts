import {
	addChallengerPoint,
	addGameOwnerPoint,
	ChallengerType,
	createGameByGameOwnerId,
	createGameSettingByGameOwnerId,
	createRoundByGameId,
	getGameByGameOwnerId,
	getGameSettingByGameOwnerId,
	getRoundsByGameId,
	minusGameOwnerPoint,
	resetGameOwnerNumberOfConsecutiveWins,
	setGameSettingById,
	setWinnerByRoundId,
	type Round,
} from "../datasources/data-provider"

export enum PlayerType {
	OWNER = 1,
	CHALLENGER = 2,
}

export enum MarkerType {
	X = "X",
	O = "O",
	EMPTY = "",
}

const DEFAULT_GAME_CONFIG = {
	consecutiveTarget: 3,
	challengerType: ChallengerType.BOT,
	botLevel: 1,
	gameSize: 3,
}

export const getGame = async (gameOwnerId: string): Promise<GameResponse> => {
	let game: GameResponse
	try {
		game = await getGameByGameOwnerId(gameOwnerId)
	} catch (error) {
		game = await createGameByGameOwnerId(gameOwnerId)
	}
	return game
}

export const getGameSetting = async (
	gameOwnerId: string
): Promise<GameSettingResponse> => {
	let gameSetting: GameSettingResponse
	try {
		gameSetting = await getGameSettingByGameOwnerId(gameOwnerId)
	} catch (error) {
		gameSetting = await createGameSettingByGameOwnerId(
			gameOwnerId,
			DEFAULT_GAME_CONFIG.consecutiveTarget,
			DEFAULT_GAME_CONFIG.challengerType,
			DEFAULT_GAME_CONFIG.botLevel,
			DEFAULT_GAME_CONFIG.gameSize
		)
	}
	return gameSetting
}

export const setGameSetting = (
	id: string,
	challengerType: ChallengerType,
	gameSize: number
): Promise<GameSettingResponse> => {
	return setGameSettingById(id, challengerType, gameSize)
}

export const processPoint = async (
	gameId: string,
	winner: PlayerType | undefined
): Promise<GameResponse> => {
	if (winner) {
		if (winner === PlayerType.OWNER) {
			return addGameOwnerPoint(gameId)
		} else if (winner === PlayerType.CHALLENGER) {
			await addChallengerPoint(gameId)
			return minusGameOwnerPoint(gameId)
		} else {
			throw "Unknown PlayerType"
		}
	} else {
		return resetGameOwnerNumberOfConsecutiveWins(gameId)
	}
}

export const createRound = async (
	gameId: string,
	gameSize: number
): Promise<Round> => {
	return createRoundByGameId(gameId, gameSize)
}

export const getRounds = async (gameId: string): Promise<Round[]> => {
	return getRoundsByGameId(gameId)
}

export const setRoundWinner = async (
	roundId: string,
	winner: PlayerType
): Promise<Round> => {
	return setWinnerByRoundId(roundId, winner)
}

export interface GameSettingResponse {
	id: string
	ownerId: string
	consecutiveTarget: number
	challengerType: ChallengerType
	botLevel: number
	gameSize: number
}

export interface GameResponse {
	id: string
	ownerId: string
	ownerPoint: number
	ownerNumberOfConsecutiveWins: number
	challengerPoint: number
}
