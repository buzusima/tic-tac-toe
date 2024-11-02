import type { BotLevel } from '../services/bot.svelte'
import { localGameConnector } from './local-storage/game'
import { localGameConfigConnector } from './local-storage/game-config'

export interface GameConfigDataProvider {
    getGameConfigByPlayerId: (playerId: string) => Promise<GameConfig>
    createGameConfigByPlayerId: (playerId: string, consecutiveTarget: number, botLevel: BotLevel) => Promise<GameConfig>
}

export interface GameDataProvider {
    getGameByPlayerId: (playerId: string) => Promise<Game>
    createGameByPlayerId: (playerId: string) => Promise<Game>
    addPlayerPoint: (gameId: string) => Promise<Game>
    minusPlayerPoint: (gameId: string) => Promise<Game>
    resetPlayerNumberOfConsecutiveWins: (gameId: string) => Promise<Game>
    addBotPoint: (gameId: string) => Promise<Game>
}

export interface GameConfig {
    id: string
    playerId: string
    consecutiveTarget: number
    botLevel: number
}

export interface Game {
    id: string
    playerId: string
    playerPoint: number
    playerNumberOfConsecutiveWins: number
    botPoint: number
}

//TODO: Read data API source from process env and do condition in the below
const gameSettingConnector: GameConfigDataProvider = localGameConfigConnector
const gameConnector: GameDataProvider = localGameConnector

export const getGameConfigByPlayerId = (playerId: string) => gameSettingConnector.getGameConfigByPlayerId(playerId)
export const createGameConfigByPlayerId = (playerId: string, consecutiveTarget: number, botLevel: BotLevel) =>
    gameSettingConnector.createGameConfigByPlayerId(playerId, consecutiveTarget, botLevel)

export const getGameByPlayerId = (playerId: string) => gameConnector.getGameByPlayerId(playerId)
export const createGameByPlayerId = (playerId: string) => gameConnector.createGameByPlayerId(playerId)
export const addPlayerPoint = (gameId: string) => gameConnector.addPlayerPoint(gameId)
export const minusPlayerPoint = (gameId: string) => gameConnector.minusPlayerPoint(gameId)
export const resetPlayerNumberOfConsecutiveWins = (gameId: string) =>
    gameConnector.resetPlayerNumberOfConsecutiveWins(gameId)
export const addBotPoint = (gameId: string) => gameConnector.addBotPoint(gameId)
