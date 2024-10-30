import {
    addBotPoint,
    addPlayerPoint,
    createGameByPlayerId,
    createGameConfigByPlayerId,
    getGameByPlayerId,
    getGameConfigByPlayerId,
    minusPlayerPoint,
    resetPlayerNumberOfConsecutiveWins,
} from '../datasources/data-provider'
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

export const getGame = async (playerId: string): Promise<GameResponse> => {
    let game: GameResponse
    try {
        game = await getGameByPlayerId(playerId)
    } catch (error) {
        game = await createGameByPlayerId(playerId)
    }
    return game
}

export const getGameConfig = async (playerId: string): Promise<GameConfigResponse> => {
    let gameConfig: GameConfigResponse
    try {
        gameConfig = await getGameConfigByPlayerId(playerId)
    } catch (error) {
        gameConfig = await createGameConfigByPlayerId(
            playerId,
            DEFAULT_GAME_CONFIG.consecutiveTarget,
            DEFAULT_GAME_CONFIG.botLevel
        )
    }
    return gameConfig
}

export const processPoint = async (gameId: string, playerType: PlayerType): Promise<GameResponse> => {
    if (playerType === PlayerType.PLAYER) {
        return addPlayerPoint(gameId)
    } else if (playerType === PlayerType.BOT) {
        await addBotPoint(gameId)
        return minusPlayerPoint(gameId)
    } else {
        return resetPlayerNumberOfConsecutiveWins(gameId)
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
