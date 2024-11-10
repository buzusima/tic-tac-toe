import { MarkerType } from "../services/game.svelte"
import type { Bot } from "./bot"

export const LogicBot: Bot = {
	selectCell: (
		gameBoard: MarkerType[][],
		winningCombinations: number[][][]
	): [number, number] => {
		const winningMove = findWinningMove(
			gameBoard,
			winningCombinations,
			MarkerType.O
		)
		if (winningMove) return winningMove

		const blockingMove = findWinningMove(
			gameBoard,
			winningCombinations,
			MarkerType.X
		)
		if (blockingMove) return blockingMove

		const emptyCells: [number, number][] = []
		gameBoard.forEach((row, rowIndex) => {
			row.forEach((cell, colIndex) => {
				if (cell === MarkerType.EMPTY) emptyCells.push([rowIndex, colIndex])
			})
		})
		return emptyCells[Math.floor(Math.random() * emptyCells.length)]
	},
}

const findWinningMove = (
	gameBoard: MarkerType[][],
	winningCombinations: number[][][],
	markerType: MarkerType
): [number, number] | null => {
	for (const combination of winningCombinations) {
		const cells = combination.map(([x, y]) => gameBoard[x][y])
		const emptyIndex = cells.indexOf(MarkerType.EMPTY)

		if (
			emptyIndex !== -1 &&
			cells.filter((cell) => cell === markerType).length === 2
		) {
			const [x, y] = combination[emptyIndex]
			return [x, y]
		}
	}

	return null
}
