import type { BotLevel } from "../bots/bot"
import type { MarkerType, PlayerType } from "../services/game.svelte"
import { localGameRoundMarkConnector } from "./local-storage/game-round-marks"
import { localGameRoundConnector } from "./local-storage/game-rounds"
import { localGameSettingConnector } from "./local-storage/game-settings"
import { localGameConnector } from "./local-storage/games"

export interface GameSettingDataProvider {
	getGameSettingByGameOwnerId: (ownerId: string) => Promise<GameSetting>
	createGameSettingByGameOwnerId: (
		ownerId: string,
		consecutiveTarget: number,
		challengerType: ChallengerType,
		botLevel: BotLevel,
		gameSize: number
	) => Promise<GameSetting>
	setGameSettingById: (
		id: string,
		challengerType: ChallengerType,
		gameSize: number
	) => Promise<GameSetting>
}

export interface GameDataProvider {
	getGameByGameOwnerId: (ownerId: string) => Promise<Game>
	createGameByGameOwnerId: (ownerId: string) => Promise<Game>
	addGameOwnerPoint: (gameId: string) => Promise<Game>
	minusGameOwnerPoint: (gameId: string) => Promise<Game>
	resetGameOwnerNumberOfConsecutiveWins: (gameId: string) => Promise<Game>
	addChallengerPoint: (gameId: string) => Promise<Game>
}

export interface RoundDataProvider {
	getRoundsByGameId: (gameId: string) => Promise<Round[]>
	createRoundByGameId: (gameId: string, gameSize: number) => Promise<Round>
	setWinnerByRoundId: (roundId: string, winner: PlayerType) => Promise<Round>
}

export interface MarkDataProvider {
	getRoundMarksByRoundId: (roundId: string) => Promise<Mark[]>
	createRoundMarkByRoundId: (
		roundId: string,
		x: number,
		y: number,
		markerType: MarkerType
	) => Promise<Mark>
}

export enum ChallengerType {
	BOT = 1,
	PLAYER = 2,
}

export interface Mark {
	id: string
	roundId: string
	x: number
	y: number
	markerType: MarkerType
}

export interface Round {
	id: string
	gameId: string
	gameSize: number
	winner: PlayerType | undefined
	gameEnd: boolean
}

export interface GameSetting {
	id: string
	ownerId: string
	consecutiveTarget: number
	challengerType: ChallengerType
	botLevel: number
	gameSize: number
}

export interface Game {
	id: string
	ownerId: string
	ownerPoint: number
	ownerNumberOfConsecutiveWins: number
	challengerPoint: number
}

//TODO: Read data API source from process env and do condition in the below
const gameSettingConnector: GameSettingDataProvider = localGameSettingConnector //TODO: import.meta.env.DATA_SOURCE == API_SERVICE ? apiServiceGameSettingConnector : localGameSettingConnector
const gameConnector: GameDataProvider = localGameConnector
const gameRoundConnector: RoundDataProvider = localGameRoundConnector
const gameMarkConnector: MarkDataProvider = localGameRoundMarkConnector

// -------------- Game Setting ----------------
export const getGameSettingByGameOwnerId = (ownerId: string) =>
	gameSettingConnector.getGameSettingByGameOwnerId(ownerId)
export const createGameSettingByGameOwnerId = (
	ownerId: string,
	consecutiveTarget: number,
	challengerType: ChallengerType,
	botLevel: BotLevel,
	gameSize: number
) =>
	gameSettingConnector.createGameSettingByGameOwnerId(
		ownerId,
		consecutiveTarget,
		challengerType,
		botLevel,
		gameSize
	)
export const setGameSettingById = (
	id: string,
	challengerType: ChallengerType,
	gameSize: number
) => gameSettingConnector.setGameSettingById(id, challengerType, gameSize)

// -------------- Game ----------------
export const getGameByGameOwnerId = (ownerId: string) =>
	gameConnector.getGameByGameOwnerId(ownerId)
export const createGameByGameOwnerId = (ownerId: string) =>
	gameConnector.createGameByGameOwnerId(ownerId)
export const addGameOwnerPoint = (gameId: string) =>
	gameConnector.addGameOwnerPoint(gameId)
export const minusGameOwnerPoint = (gameId: string) =>
	gameConnector.minusGameOwnerPoint(gameId)
export const resetGameOwnerNumberOfConsecutiveWins = (gameId: string) =>
	gameConnector.resetGameOwnerNumberOfConsecutiveWins(gameId)
export const addChallengerPoint = (gameId: string) =>
	gameConnector.addChallengerPoint(gameId)

// -------------- Round ----------------
export const getRoundsByGameId = (gameId: string) =>
	gameRoundConnector.getRoundsByGameId(gameId)
export const createRoundByGameId = (gameId: string, gameSize: number) =>
	gameRoundConnector.createRoundByGameId(gameId, gameSize)
export const setWinnerByRoundId = (roundId: string, winner: PlayerType) =>
	gameRoundConnector.setWinnerByRoundId(roundId, winner)

// -------------- Mark ----------------
export const getRoundMarksByRoundId = (roundId: string) =>
	gameMarkConnector.getRoundMarksByRoundId(roundId)
export const createRoundMarkByRoundId = (
	roundId: string,
	x: number,
	y: number,
	markerType: MarkerType
) => gameMarkConnector.createRoundMarkByRoundId(roundId, x, y, markerType)
