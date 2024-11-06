import { MarkerType } from "../services/game.svelte"
import type { Bot } from "./bot"

export const RandomBot: Bot = {
	selectCell: (board: MarkerType[][]): [number, number] => {
		const emptyCells = getEmptyCell(board)
		const selectedCell = emptyCells[randomIndex(emptyCells.length)]

		return [selectedCell[0], selectedCell[1]]
	},
}

const getEmptyCell = (board: MarkerType[][]) => {
	let emptyCells = []
	for (const [rowIndex, row] of board.entries()) {
		for (const [colIndex, cell] of row.entries()) {
			if (cell === MarkerType.EMPTY) emptyCells.push([rowIndex, colIndex])
		}
	}
	return emptyCells
}

const randomIndex = (indexSize: number): number =>
	Math.floor(Math.random() * indexSize)
