<script lang="ts">
    import { onMount } from 'svelte'

    enum GamePlayerEnum {
        PLAYER = 'X',
        BOT = 'O',
        EMPTY = '',
    }

    const GAME_SIZE = 3

    let gameBoard: GamePlayerEnum[][]
    let winningCombinations: number[][][]
    let currentPlayer: GamePlayerEnum = GamePlayerEnum.PLAYER

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

    const checkWinner = (board: GamePlayerEnum[][], player: GamePlayerEnum) =>
        winningCombinations.some((combination) => combination.every(([x, y]) => board[x][y] === player))

    const isDraw = (board: GamePlayerEnum[][]): boolean =>
        board.every((row) => row.every((cell) => cell !== GamePlayerEnum.EMPTY))

    const switchPlayer = (player: GamePlayerEnum) =>
        player == GamePlayerEnum.PLAYER ? GamePlayerEnum.BOT : GamePlayerEnum.PLAYER

    const handleOnSqureClick = (rowIndex: number, colIndex: number) => {
        if (gameBoard[rowIndex][colIndex] === GamePlayerEnum.EMPTY) {
            gameBoard[rowIndex][colIndex] = currentPlayer

            const hasWinner = checkWinner(gameBoard, currentPlayer)
            if (hasWinner) {
                alert(`${currentPlayer} win!!`)
            } else {
                const draw = isDraw(gameBoard)
                if (draw) {
                    alert(`draw!!`)
                } else {
                    currentPlayer = switchPlayer(currentPlayer)
                }
            }
        }
    }

    onMount(() => {
        gameBoard = generateBoard(GAME_SIZE)
        winningCombinations = generateWinningCombinations(GAME_SIZE)
    })
</script>

<div class="game-board">
    {#each gameBoard as row, rowIndex}
        <div class="row">
            {#each row as cell, colIndex}
                <button class="cell" type="button" onclick={() => handleOnSqureClick(rowIndex, colIndex)}>
                    {cell}
                </button>
            {/each}
        </div>
    {/each}
</div>

<style>
    .game-board {
        display: grid;
        gap: 0.313rem;

        > .row {
            display: flex;
            gap: 0.313rem;
        }

        .cell {
            width: 3.125rem;
            height: 3.125rem;
        }
    }
</style>
