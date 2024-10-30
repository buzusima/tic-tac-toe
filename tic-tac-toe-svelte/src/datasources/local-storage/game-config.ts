import { v4 as uuidv4 } from 'uuid'
import { BotLevel } from '../../services/bot.svelte'
import type { GameConfig, GameConfigDataProvider } from '../data-provider'

const GAME_CONFIGS_KEY = 'game-configs'

const getGameConfigs = () => localStorage.getItem(GAME_CONFIGS_KEY)

const setGameConfigs = (gameConfigs: GameConfig[]) =>
    localStorage.setItem(GAME_CONFIGS_KEY, JSON.stringify(gameConfigs))

export const localGameConfigConnector: GameConfigDataProvider = {
    getGameConfigByPlayerId: (playerId: string): Promise<GameConfig> => {
        const gameConfigsJson = getGameConfigs()

        let gameConfigs: GameConfig[] | undefined
        if (gameConfigsJson) gameConfigs = JSON.parse(gameConfigsJson)
        if (!gameConfigs) return Promise.reject(new Error('Game config not found'))

        const gameConfig = findGameConfigByPlayerId(gameConfigs, playerId)

        if (gameConfig) return Promise.resolve(gameConfig)
        else return Promise.reject(new Error('Game config not found'))
    },
    
    createGameConfigByPlayerId: (
        playerId: string,
        consecutiveTarget: number,
        botLevel: BotLevel
    ): Promise<GameConfig> => {
        let gameConfigs = findAllGameConfigs()
        if (!gameConfigs) gameConfigs = []

        const newGameConfig: GameConfig = {
            id: uuidv4(),
            playerId: playerId,
            consecutiveTarget: consecutiveTarget,
            botLevel: botLevel,
        }

        gameConfigs.push(newGameConfig)

        setGameConfigs(gameConfigs)

        return Promise.resolve(newGameConfig)
    },
}

const findAllGameConfigs = (): GameConfig[] => {
    const gameConfigsJson = getGameConfigs()

    if (gameConfigsJson) return JSON.parse(gameConfigsJson)

    return []
}

const findGameConfigByPlayerId = (gameConfigs: GameConfig[], playerId: string): GameConfig =>
    gameConfigs.find((gameConfig) => gameConfig.playerId == playerId)
