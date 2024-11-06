import type { BotLevel } from '../bots/bot'
import { localGameConnector } from './local-storage/game'
import { localGameSettingConnector } from './local-storage/game-config'

export interface GameSettingDataProvider {
    getGameSettingByGameOwnerId: (ownerId: string) => Promise<GameSetting>
    createGameSettingByGameOwnerId: (
        ownerId: string,
        consecutiveTarget: number,
        challengerType: ChallengerType,
        botLevel: BotLevel,
        gameSize: number) => Promise<GameSetting>
    setGameSettingById: (
        id: string,
        challengerType: ChallengerType,
        gameSize: number) => Promise<GameSetting>
}

export interface GameDataProvider {
    getGameByGameOwnerId: (ownerId: string) => Promise<Game>
    createGameByGameOwnerId: (ownerId: string) => Promise<Game>
    addGameOwnerPoint: (gameId: string) => Promise<Game>
    minusGameOwnerPoint: (gameId: string) => Promise<Game>
    resetGameOwnerNumberOfConsecutiveWins: (gameId: string) => Promise<Game>
    addChallengerPoint: (gameId: string) => Promise<Game>
}

export enum ChallengerType {
    BOT = 1,
    PLAYER = 2
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
const gameSettingConnector: GameSettingDataProvider = localGameSettingConnector
const gameConnector: GameDataProvider = localGameConnector

export const getGameSettingByGameOwnerId = (ownerId: string) => gameSettingConnector.getGameSettingByGameOwnerId(ownerId)
export const createGameSettingByGameOwnerId = (
    ownerId: string,
    consecutiveTarget: number,
    challengerType: ChallengerType,
    botLevel: BotLevel,
    gameSize: number) =>
    gameSettingConnector.createGameSettingByGameOwnerId(ownerId, consecutiveTarget, challengerType, botLevel, gameSize)
export const setGameSettingById = (
    id: string,
    challengerType: ChallengerType,
    gameSize: number) =>
    gameSettingConnector.setGameSettingById(id, challengerType, gameSize)

export const getGameByGameOwnerId = (ownerId: string) => gameConnector.getGameByGameOwnerId(ownerId)
export const createGameByGameOwnerId = (ownerId: string) => gameConnector.createGameByGameOwnerId(ownerId)
export const addGameOwnerPoint = (gameId: string) => gameConnector.addGameOwnerPoint(gameId)
export const minusGameOwnerPoint = (gameId: string) => gameConnector.minusGameOwnerPoint(gameId)
export const resetGameOwnerNumberOfConsecutiveWins = (gameId: string) =>
    gameConnector.resetGameOwnerNumberOfConsecutiveWins(gameId)
export const addChallengerPoint = (gameId: string) => gameConnector.addChallengerPoint(gameId)
