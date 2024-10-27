import { v4 as uuidv4 } from 'uuid'

const GAMES_KEY = 'games'

const getGames = () => localStorage.getItem(GAMES_KEY)

const setGames = (games: Game[]) => localStorage.setItem(GAMES_KEY, JSON.stringify(games))

export const getGameByPlayerId = (playerId: string): Promise<Game> => {
    const gameConfigsJson = getGames()

    let games: Game[]
    if (gameConfigsJson) games = JSON.parse(gameConfigsJson)
    if (!games) Promise.reject('Game not found')

    const game = findGameByPlayerId(games, playerId)

    if (game) return Promise.resolve(game)
    else Promise.reject('Game not found')
}

export const createGameByPlayerId = (playerId: string): Promise<Game> => {
    let games = findAllGames()
    if (!games) games = []

    const newGame: Game = {
        id: uuidv4(),
        playerId: playerId,
        playerPoint: 0,
        playerNumberOfConsecutiveWins: 0,
        botPoint: 0,
    }

    games.push(newGame)

    setGames(games)

    return Promise.resolve(newGame)
}

export const addPlayerPoint = (gameId: string): Promise<Game> => {
    let games = findAllGames()
    if (!games) Promise.reject('Game not found')

    const gameIndex = findGameIndexById(games, gameId)
    if (gameIndex == -1) Promise.reject('Game not found')

    games[gameIndex].playerNumberOfConsecutiveWins += 1
    games[gameIndex].playerPoint += 1

    if (games[gameIndex].playerNumberOfConsecutiveWins >= 3) {
        games[gameIndex].playerNumberOfConsecutiveWins = 0
        games[gameIndex].playerPoint += 1
    }

    setGames(games)

    return Promise.resolve(games[gameIndex])
}

export const minusPlayerPoint = (gameId: string): Promise<Game> => {
    let games = findAllGames()
    if (!games) Promise.reject('Game not found')

    const gameIndex = findGameIndexById(games, gameId)
    if (gameIndex == -1) Promise.reject('Game not found')

    games[gameIndex].playerPoint -= 1

    setGames(games)

    return Promise.resolve(games[gameIndex])
}

export const addBotPoint = (gameId: string): Promise<Game> => {
    let games = findAllGames()
    if (!games) Promise.reject('Game not found')

    const gameIndex = findGameIndexById(games, gameId)
    if (gameIndex == -1) Promise.reject('Game not found')

    games[gameIndex].botPoint += 1
    games[gameIndex].playerNumberOfConsecutiveWins = 0

    setGames(games)

    return Promise.resolve(games[gameIndex])
}

const findAllGames = (): Game[] => {
    const gamesJson = getGames()

    if (gamesJson) return JSON.parse(gamesJson)

    return []
}

const findGameByPlayerId = (games: Game[], playerId: string): Game => games.find((game) => game.playerId == playerId)

const findGameIndexById = (games: Game[], id: string): number => games.findIndex((game) => game.id == id)

interface Game {
    id: string
    playerId: string
    playerPoint: number
    playerNumberOfConsecutiveWins: number
    botPoint: number
}
