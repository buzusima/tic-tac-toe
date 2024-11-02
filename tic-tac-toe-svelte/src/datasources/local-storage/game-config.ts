import { v4 as uuidv4 } from 'uuid'
import { BotLevel } from '../../services/bot.svelte'
import type { GameConfig, GameConfigDataProvider } from '../data-provider'

const GAME_CONFIGS_KEY = 'game-configs'

const getGameConfigs = () => localStorage.getItem(GAME_CONFIGS_KEY)

const setGameConfigs = (gameSettings: GameConfig[]) =>
    localStorage.setItem(GAME_CONFIGS_KEY, JSON.stringify(gameSettings))

export const localGameConfigConnector: GameConfigDataProvider = {
    getGameConfigByPlayerId: (playerId: string): Promise<GameConfig> => {
        const gameSettingsJson = getGameConfigs()

        let gameSettings: GameConfig[] | undefined
        if (gameSettingsJson) gameSettings = JSON.parse(gameSettingsJson)
        if (!gameSettings) return Promise.reject(new Error('Game config not found'))

        const gameSetting = findGameConfigByPlayerId(gameSettings, playerId)

        if (gameSetting) return Promise.resolve(gameSetting)
        else return Promise.reject(new Error('Game config not found'))
    },
    
    createGameConfigByPlayerId: (
        playerId: string,
        consecutiveTarget: number,
        botLevel: BotLevel
    ): Promise<GameConfig> => {
        let gameSettings = findAllGameConfigs()
        if (!gameSettings) gameSettings = []

        const newGameConfig: GameConfig = {
            id: uuidv4(),
            playerId: playerId,
            consecutiveTarget: consecutiveTarget,
            botLevel: botLevel,
        }

        gameSettings.push(newGameConfig)

        setGameConfigs(gameSettings)

        return Promise.resolve(newGameConfig)
    },
}

const findAllGameConfigs = (): GameConfig[] => {
    const gameSettingsJson = getGameConfigs()

    if (gameSettingsJson) return JSON.parse(gameSettingsJson)

    return []
}

const findGameConfigByPlayerId = (gameSettings: GameConfig[], playerId: string): GameConfig =>
    gameSettings.find((gameSetting) => gameSetting.playerId == playerId)
