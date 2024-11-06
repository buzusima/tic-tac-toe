import {
    addChallengerPoint,
    addGameOwnerPoint,
    ChallengerType,
    createGameByGameOwnerId,
    createGameSettingByGameOwnerId,
    setGameSettingById,
    getGameByGameOwnerId,
    getGameSettingByGameOwnerId,
    minusGameOwnerPoint,
    resetGameOwnerNumberOfConsecutiveWins,
} from '../datasources/data-provider'

export enum PlayerType {
    PLAYER = 'X',
    BOT = 'O',
    EMPTY = '',
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

export const getGameSetting = async (gameOwnerId: string): Promise<GameSettingResponse> => {
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

export const setGameSetting = (id: string, challengerType: ChallengerType, gameSize: number): Promise<GameSettingResponse> => {
    return setGameSettingById(id, challengerType, gameSize)
}

export const processPoint = async (gameId: string, playerType: PlayerType): Promise<GameResponse> => {
    if (playerType === PlayerType.PLAYER) {
        return addGameOwnerPoint(gameId)
    } else if (playerType === PlayerType.BOT) {
        await addChallengerPoint(gameId)
        return minusGameOwnerPoint(gameId)
    } else {
        return resetGameOwnerNumberOfConsecutiveWins(gameId)
    }
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
