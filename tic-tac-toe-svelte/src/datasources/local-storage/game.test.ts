import { PlayerType } from "../../services/game.svelte"
import { Game } from "../data-provider"
import { localGameConnector } from "./games"

describe("Test player win", () => {
	let game: Game

	beforeEach(async () => {
		game = await localGameConnector.createGameByGameOwnerId("MOCK_OWNER_ID")
	})

	test("Owner +1 point when normal win", async () => {
		game = await localGameConnector.processWinner(game.id, PlayerType.OWNER)

		expect(game.ownerPoint).toEqual(1)
		expect(game.ownerNumberOfConsecutiveWins).toEqual(1)
		expect(game.challengerPoint).toEqual(0)
	})

	test("Owner +2 point when consecutive win reach 3 times", async () => {
		await localGameConnector.processWinner(game.id, PlayerType.OWNER)
		await localGameConnector.processWinner(game.id, PlayerType.OWNER)

		game = await localGameConnector.processWinner(game.id, PlayerType.OWNER)

		expect(game.ownerPoint).toEqual(3 + 1)
		expect(game.ownerNumberOfConsecutiveWins).toEqual(0)
		expect(game.challengerPoint).toEqual(0)
	})

	test("Owner +1 point after received bonus point", async () => {
		await localGameConnector.processWinner(game.id, PlayerType.OWNER)
		await localGameConnector.processWinner(game.id, PlayerType.OWNER)
		await localGameConnector.processWinner(game.id, PlayerType.OWNER)

		game = await localGameConnector.processWinner(game.id, PlayerType.OWNER)

		expect(game.ownerPoint).toEqual(3 + 1 + 1)
		expect(game.ownerNumberOfConsecutiveWins).toEqual(1)
		expect(game.challengerPoint).toEqual(0)
	})
})

describe("Test challenger win", () => {
	let game: Game

	beforeEach(async () => {
		game = await localGameConnector.createGameByGameOwnerId("MOCK_OWNER_ID")
	})

	test("Chanllenger +1 point, when normal win with owner have no point", async () => {
		game = await localGameConnector.processWinner(
			game.id,
			PlayerType.CHALLENGER
		)

		expect(game.ownerPoint).toEqual(0)
		expect(game.ownerNumberOfConsecutiveWins).toEqual(0)
		expect(game.challengerPoint).toEqual(1)
	})

	test("Chanllenger +1 point, Owner -1 point, consecutive win reset to 0, when normal win with owner have a point", async () => {
		game = await localGameConnector.processWinner(game.id, PlayerType.OWNER)
		game = await localGameConnector.processWinner(game.id, PlayerType.OWNER)

		expect(game.ownerPoint).toEqual(2)
		expect(game.ownerNumberOfConsecutiveWins).toEqual(2)
		expect(game.challengerPoint).toEqual(0)

		game = await localGameConnector.processWinner(
			game.id,
			PlayerType.CHALLENGER
		)

		expect(game.ownerPoint).toEqual(1)
		expect(game.ownerNumberOfConsecutiveWins).toEqual(0)
		expect(game.challengerPoint).toEqual(1)
	})
})

describe("Test draw", () => {
	let game: Game

	beforeEach(async () => {
		game = await localGameConnector.createGameByGameOwnerId("MOCK_OWNER_ID")
	})

	test("Owner consecutive win must be reset to 0", async () => {
		game = await localGameConnector.processWinner(game.id, PlayerType.OWNER)
		game = await localGameConnector.processWinner(game.id, PlayerType.OWNER)

		game = await localGameConnector.processWinner(game.id, null)

		expect(game.ownerPoint).toEqual(2)
		expect(game.ownerNumberOfConsecutiveWins).toEqual(0)
		expect(game.challengerPoint).toEqual(0)
	})
})
