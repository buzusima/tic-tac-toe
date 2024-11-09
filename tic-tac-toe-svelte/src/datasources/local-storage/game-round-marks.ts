import { v4 as uuidv4 } from "uuid"
import { MarkerType } from "../../services/game.svelte"
import type { Mark, MarkDataProvider } from "../data-provider"

const MARKS_KEY = "mark"

const getGameRoundMarks = () => localStorage.getItem(MARKS_KEY)

const setGameRoundMarks = (marks: Mark[]) =>
	localStorage.setItem(MARKS_KEY, JSON.stringify(marks))

const findAllGameRoundMarks = (): Mark[] => {
	const gameRounesJson = getGameRoundMarks()

	if (gameRounesJson) return JSON.parse(gameRounesJson)

	return []
}

const findGameRoundMarksByRoundId = (
	gameRoundMarks: Mark[],
	roundId: string
): Mark[] => gameRoundMarks.filter((mark) => mark.roundId == roundId)

export const localGameRoundMarkConnector: MarkDataProvider = {
	getRoundMarksByRoundId: (roundId: string): Promise<Mark[]> => {
		const gameRoundMarks = findAllGameRoundMarks()
		const gameRoundMarksOfId = findGameRoundMarksByRoundId(
			gameRoundMarks,
			roundId
		)

		return Promise.resolve(gameRoundMarksOfId)
	},

	createRoundMarkByRoundId: (
		roundId: string,
		x: number,
		y: number,
		markerType: MarkerType
	): Promise<Mark> => {
		const gameRoundMarks = findAllGameRoundMarks()

		const newRoumdMark: Mark = {
			id: uuidv4(),
			roundId: roundId,
			x: x,
			y: y,
			markerType: markerType,
		}

		gameRoundMarks.push(newRoumdMark)

		setGameRoundMarks(gameRoundMarks)

		return Promise.resolve(newRoumdMark)
	},
}
