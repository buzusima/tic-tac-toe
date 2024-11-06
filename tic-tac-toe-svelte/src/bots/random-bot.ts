import type { Bot } from './bot'
import { PlayerType } from '../services/game.svelte'

export const RandomBot: Bot = {
    selectCell: (board: PlayerType[][]): [number, number] => {
        const emptyCells = getEmptyCell(board)
        const selectedCell = emptyCells[randomIndex(emptyCells.length)]

        return [selectedCell[0], selectedCell[1]]
    },
}

const getEmptyCell = (board: PlayerType[][]) => {
    let emptyCells = []
    for (const [rowIndex, row] of board.entries()) {
        for (const [colIndex, cell] of row.entries()) {
            if (cell === PlayerType.EMPTY) emptyCells.push([rowIndex, colIndex])
        }
    }
    return emptyCells
}

const randomIndex = (indexSize: number): number => Math.floor(Math.random() * indexSize)
