import { GamePlayerEnum } from '../services/game.svelte'

export class RandomBot {
    private getEmptyCell = (board: GamePlayerEnum[][]) => {
        let emptyCells = []
        for (const [rowIndex, row] of board.entries()) {
            for (const [colIndex, cell] of row.entries()) {
                if (cell === GamePlayerEnum.EMPTY) emptyCells.push([rowIndex, colIndex])
            }
        }
        return emptyCells
    }

    private randomIndex = (indexSize: number): number => Math.floor(Math.random() * indexSize)

    selectCell = (board: GamePlayerEnum[][]): [number, number] => {
        const emptyCells = this.getEmptyCell(board)

        return emptyCells[this.randomIndex(emptyCells.length)]
    }
}
