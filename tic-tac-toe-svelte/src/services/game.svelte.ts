import { get, writable } from 'svelte/store'

export enum GamePlayerEnum {
    PLAYER = 'X',
    BOT = 'O',
    EMPTY = '',
}

export const CONSECUTIVE_TARGET = 3

export let playerPoint = writable(0)
export let botPoint = writable(0)
export let consecutiveWins = writable(0)

//TODO: Implement datasource

export const getGame = async (playId: string): Promise<GameResponse> => {
    return Promise.resolve({
        id: 'string',
        playerPoint: 10,
        playerNumberOfConsecutiveWins: 2,
        botPoint: 5,
    })
}

export const processConsecutiveWin = (player: GamePlayerEnum) => {
    if (!player) return
    
    if (player === GamePlayerEnum.PLAYER) {
        consecutiveWins.update((n) => n + 1)
    } else {
        consecutiveWins.set(0)
    }
}

export const processPoint = (player: GamePlayerEnum) => {
    if (!player) return

    if (player === GamePlayerEnum.PLAYER) {
        playerPoint.update((point) => point + 1)

        addBonusIfReachConsecutiveTargetAndReset()
    } else {
        botPoint.update((point) => point + 1)
        if (get(playerPoint) > 0) playerPoint.update((point) => point - 1)
    }
}

const addBonusIfReachConsecutiveTargetAndReset = () => {
    if (CONSECUTIVE_TARGET == get(consecutiveWins)) {
        playerPoint.update((point) => point + 1)

        consecutiveWins.set(0)
    }
}

export interface AddPointRequest {}

export interface GameResponse {
    id: string
    playerPoint: number
    playerNumberOfConsecutiveWins: number
    botPoint: number
}
