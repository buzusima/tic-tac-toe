<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import type { RandomBot } from '../../bots/random'
    import { GamePlayerEnum } from '../../services/game.svelte'

    export let gameSize = 3
    export let bot: RandomBot
    export let currentPlayer: GamePlayerEnum = GamePlayerEnum.PLAYER

    export const resetBoard = async () => {
        gameBoard = generateBoard(gameSize)
        gameFreezed = false
        winner = undefined
        winnerCombination = undefined
        currentPlayer = GamePlayerEnum.PLAYER
    }

    const dispatch = createEventDispatcher()

    let winningCombinations: number[][][]

    let gameBoard: GamePlayerEnum[][]
    let gameFreezed = false
    let winner: GamePlayerEnum | undefined
    let winnerCombination: number[][] | undefined

    const generateBoard = (size: number): GamePlayerEnum[][] => {
        const board: GamePlayerEnum[][] = []

        for (let i = 0; i < size; i++) {
            const row = new Array(size).fill(GamePlayerEnum.EMPTY)
            board.push(row)
        }

        return board
    }

    const generateWinningCombinations = (size: number): number[][][] => {
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

    const checkWinner = (board: GamePlayerEnum[][], player: GamePlayerEnum): GamePlayerEnum | undefined => {
        winnerCombination = winningCombinations.find((combination) =>
            combination.every(([x, y]) => board[x][y] === player)
        )
        return winnerCombination ? player : undefined
    }

    const isDraw = (board: GamePlayerEnum[][]): boolean =>
        board.every((row) => row.every((cell) => cell !== GamePlayerEnum.EMPTY))

    const switchPlayer = (player: GamePlayerEnum) =>
        player == GamePlayerEnum.PLAYER ? GamePlayerEnum.BOT : GamePlayerEnum.PLAYER

    const botTurn = async (board: GamePlayerEnum[][]) => {
        gameFreezed = true
        await new Promise((f) => setTimeout(f, 500)) // Bot think
        gameFreezed = false

        const [rowIndex, colIndex] = bot.selectCell(board)
        gameBoard[rowIndex][colIndex] = GamePlayerEnum.BOT

        processAfterCellClick()
    }

    const handleOnCellClick = (rowIndex: number, colIndex: number) => {
        if (gameBoard && gameBoard[rowIndex][colIndex] === GamePlayerEnum.EMPTY && !gameFreezed) {
            gameBoard[rowIndex][colIndex] = GamePlayerEnum.PLAYER

            processAfterCellClick()
        }
    }

    const processAfterCellClick = () => {
        winner = checkWinner(gameBoard, currentPlayer)

        if (winner) {
            gameFreezed = true
            dispatch('gameEnd', currentPlayer)
        } else {
            const draw = isDraw(gameBoard)
            if (draw) {
                gameFreezed = true
                dispatch('gameEnd')
            } else {
                currentPlayer = switchPlayer(currentPlayer)
                if (currentPlayer === GamePlayerEnum.BOT) botTurn(gameBoard)
            }
        }
    }

    onMount(() => {
        gameBoard = generateBoard(gameSize)
        winningCombinations = generateWinningCombinations(gameSize)
    })
</script>

{#if gameBoard}
    <div class="game-board" in:fade>
        {#each gameBoard as row, rowIndex}
            <div class="row">
                {#each row as cell, colIndex}
                    <button
                        class="cell {winnerCombination &&
                        winnerCombination.some((element) => {
                            const row = element[0]
                            const col = element[1]
                            return row == rowIndex && col == colIndex
                        })
                            ? winner === GamePlayerEnum.PLAYER
                                ? 'player-win'
                                : 'bot-win'
                            : ''}"
                        type="button"
                        onclick={() => handleOnCellClick(rowIndex, colIndex)}
                    >
                        {#key cell}
                            <span transition:fade={{ duration: 200 }}>{cell}</span>
                        {/key}
                    </button>
                {/each}
            </div>
        {/each}
    </div>
{/if}

<style>
    .game-board {
        display: grid;
        gap: 0.313rem;
        margin: auto;

        > .row {
            display: flex;
            gap: 0.313rem;
        }

        .cell {
            width: 3.125rem;
            height: 3.125rem;

            &.player-win {
                color: lightgreen;
            }
            &.bot-win {
                color: lightcoral;
            }
        }
    }
</style>
