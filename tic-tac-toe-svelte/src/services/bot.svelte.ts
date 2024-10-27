import { RandomBot } from '../bots/random'
import { PlayerType } from './game.svelte'

export enum BotLevel {
    EASY = 1,
    MEDIUM = 2,
    HARD = 3,
}

export const getBot = (botLevel: BotLevel): Bot => {
    switch (botLevel) {
        case BotLevel.EASY:
            return new RandomBot()
        case BotLevel.MEDIUM:
        // return new LogicBot()
        case BotLevel.HARD:
        // return new AiBot()
        default:
            return new RandomBot()
    }
}

export interface Bot {
    selectCell(board: PlayerType[][]): [number, number]
}
