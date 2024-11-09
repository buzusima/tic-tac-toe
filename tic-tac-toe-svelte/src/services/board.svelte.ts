import { MarkerType } from "./game.svelte"

export const generateBoard = (size: number): MarkerType[][] => {
	const board: MarkerType[][] = []

	for (let i = 0; i < size; i++) {
		const row = new Array(size).fill(MarkerType.EMPTY)
		board.push(row)
	}

	return board
}

export const generateWinningCombinations = (size: number): number[][][] => {
	const combinations: number[][][] = []

	// Rows
	for (let row = 0; row < size; row++) {
		const rowCombination = []
		for (let col = 0; col < size; col++) {
			rowCombination.push([row, col])
		}
		combinations.push(rowCombination)
	}

	// Columns
	for (let col = 0; col < size; col++) {
		const colCombination = []
		for (let row = 0; row < size; row++) {
			colCombination.push([row, col])
		}
		combinations.push(colCombination)
	}

	// Diagonal (top-left to bottom-right)
	const diagonal1 = []
	for (let i = 0; i < size; i++) {
		diagonal1.push([i, i])
	}
	combinations.push(diagonal1)

	// Diagonal (top-right to bottom-left)
	const diagonal2 = []
	for (let i = 0; i < size; i++) {
		diagonal2.push([i, size - i - 1])
	}
	combinations.push(diagonal2)

	return combinations
}
