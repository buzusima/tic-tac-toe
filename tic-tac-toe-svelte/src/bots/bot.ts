import { RandomBot } from './random-bot'
import { PlayerType } from '../services/game.svelte'

export const getBot = (botLevel: BotLevel): Bot => {
    switch (botLevel) {
        case BotLevel.EASY:
            return RandomBot
        case BotLevel.MEDIUM:
        // return new LogicBot()
        case BotLevel.HARD:
        // return new AiBot()
        default:
            return RandomBot
    }
}

export enum BotLevel {
    EASY = 1,
    MEDIUM = 2,
    HARD = 3,
}

export interface Bot {
    selectCell(board: PlayerType[][]): [number, number]
}
