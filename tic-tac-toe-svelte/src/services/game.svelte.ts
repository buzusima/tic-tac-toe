import type { BotLevel } from "../bots/bot"
import {
	ChallengerType,
	createGameByGameOwnerId,
	createGameSettingByGameId,
	createRoundByGameId,
	createRoundMarkByRoundId,
	getGameByGameOwnerId,
	getGameSettingByGameId,
	getRoundMarksByRoundId,
	getRoundsByGameId,
	processWinner,
	setGameSettingById,
	setWinnerByRoundId,
	type Mark,
	type Round
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
	botLevel: 2,
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
	gameId: string
): Promise<GameSettingResponse> => {
	let gameSetting: GameSettingResponse
	try {
		gameSetting = await getGameSettingByGameId(gameId)
	} catch (error) {
		gameSetting = await createGameSettingByGameId(
			gameId,
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
	botLevel: BotLevel,
	gameSize: number
): Promise<GameSettingResponse> => {
	return setGameSettingById(id, challengerType, botLevel, gameSize)
}

export const processPoint = async (
	gameId: string,
	winner: PlayerType | null
): Promise<GameResponse> => {
	return processWinner(gameId, winner)
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

export const getRoundMarks = async (roundId: string): Promise<Mark[]> => {
	return getRoundMarksByRoundId(roundId)
}

export const createRoundMark = (
	roundId: string,
	rowIndex: number,
	colIndex: number,
	markerType: MarkerType
) => {
	return createRoundMarkByRoundId(roundId, rowIndex, colIndex, markerType)
}

export interface GameSettingResponse {
	id: string
	gameId: string
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
