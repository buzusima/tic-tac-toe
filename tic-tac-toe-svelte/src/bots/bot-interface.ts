import { GamePlayerEnum } from '../services/game.svelte'

export interface Bot {
    selectCell(board: GamePlayerEnum[][]): [number, number]
}
