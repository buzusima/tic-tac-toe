import type { BotLevel } from "../bots/bot"
import type { MarkerType, PlayerType } from "../services/game.svelte"
import { localGameRoundMarkConnector } from "./local-storage/game-round-marks"
import { localGameRoundConnector } from "./local-storage/game-rounds"
import { localGameSettingConnector } from "./local-storage/game-settings"
import { localGameConnector } from "./local-storage/games"

export interface GameDataProvider {
	getGameByGameOwnerId: (ownerId: string) => Promise<Game>
	createGameByGameOwnerId: (ownerId: string) => Promise<Game>
	processWinner: (
		gameId: string,
		winner: PlayerType | null
	) => Promise<Game>
}

export interface GameSettingDataProvider {
	getGameSettingByGameId: (gameId: string) => Promise<GameSetting>
	createGameSettingByGameId: (
		gameId: string,
		consecutiveTarget: number,
		challengerType: ChallengerType,
		botLevel: BotLevel,
		gameSize: number
	) => Promise<GameSetting>
	setGameSettingById: (
		id: string,
		challengerType: ChallengerType,
		botLevel: BotLevel,
		gameSize: number
	) => Promise<GameSetting>
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
		rowIndex: number,
		colIndex: number,
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
	rowIndex: number
	colIndex: number
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
	gameId: string
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
export const getGameSettingByGameId = (gameId: string) =>
	gameSettingConnector.getGameSettingByGameId(gameId)
export const createGameSettingByGameId = (
	gameId: string,
	consecutiveTarget: number,
	challengerType: ChallengerType,
	botLevel: BotLevel,
	gameSize: number
) =>
	gameSettingConnector.createGameSettingByGameId(
		gameId,
		consecutiveTarget,
		challengerType,
		botLevel,
		gameSize
	)
export const setGameSettingById = (
	id: string,
	challengerType: ChallengerType,
	botLevel: BotLevel,
	gameSize: number
) =>
	gameSettingConnector.setGameSettingById(
		id,
		challengerType,
		botLevel,
		gameSize
	)

// -------------- Game ----------------
export const getGameByGameOwnerId = (ownerId: string) =>
	gameConnector.getGameByGameOwnerId(ownerId)
export const createGameByGameOwnerId = (ownerId: string) =>
	gameConnector.createGameByGameOwnerId(ownerId)
export const processWinner = (
	gameId: string,
	winner: PlayerType | null
) => gameConnector.processWinner(gameId, winner)

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
