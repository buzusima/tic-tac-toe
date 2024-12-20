import type { MarkerType } from "../services/game.svelte"
import { LogicBot } from "./logic-bot"
import { RandomBot } from "./random-bot"

export const getBot = (botLevel: BotLevel): Bot => {
	switch (botLevel) {
		case BotLevel.EASY:
			return RandomBot
		case BotLevel.MEDIUM:
			return LogicBot
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
	selectCell(
		board: MarkerType[][],
		winningCombinations?: number[][][]
	): [number, number]
}
