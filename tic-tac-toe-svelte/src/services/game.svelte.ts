import {
    addBotPoint,
    addPlayerPoint,
    createGameByPlayerId,
    getGameByPlayerId,
    minusPlayerPoint,
} from '../datasources/local-storage/game'
import { createGameConfigByPlayerId, getGameConfigByPlayerId } from '../datasources/local-storage/game-config'
import { BotLevel } from './bot.svelte'

export enum PlayerType {
    PLAYER = 'X',
    BOT = 'O',
    EMPTY = '',
}

const DEFAULT_GAME_CONFIG: GameConfigResponse = {
    consecutiveTarget: 3,
    botLevel: BotLevel.EASY,
}

export const getGame = (playerId: string): Promise<GameResponse> => {
    try {
        return getGameByPlayerId(playerId)
    } catch (error) {
        return createGameByPlayerId(playerId)
    }
}

export const getGameConfig = (playerId: string): Promise<GameConfigResponse> => {
    try {
        return getGameConfigByPlayerId(playerId)
    } catch (error) {
        return createGameConfigByPlayerId(playerId, DEFAULT_GAME_CONFIG.consecutiveTarget, DEFAULT_GAME_CONFIG.botLevel)
    }
}

export const processPoint = async (gameId: string, playerType: PlayerType): Promise<GameResponse> => {
    if (!playerType) return

    if (playerType === PlayerType.PLAYER) {
        return addPlayerPoint(gameId)
    } else {
        await addBotPoint(gameId)
        return minusPlayerPoint(gameId)
    }
}

export interface GameConfigResponse {
    consecutiveTarget: number
    botLevel: number
}

export interface GameResponse {
    id: string
    playerId: string
    playerPoint: number
    playerNumberOfConsecutiveWins: number
    botPoint: number
}
