<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";
    import { getBot, type Bot } from "../../bots/bot";
    import {
        PlayerType,
        type GameResponse,
        type GameSettingResponse,
    } from "../../services/game.svelte";

    let {
        gameSetting = $bindable(),
        game = $bindable(),
    }: {
        gameSetting: GameSettingResponse;
        game: GameResponse;
    } = $props();

    const dispatch = createEventDispatcher();

    let winningCombinations: number[][][];

    let gameBoard = $state<PlayerType[][]>();
    let gameFreezed = $state<boolean>(false);
    let winner = $state<PlayerType>();
    let winnerCombination = $state<number[][]>();
    let currentPlayer: PlayerType = PlayerType.PLAYER;
    let bot = $state<Bot>();

    $effect(() => {
        if (gameSetting) initBoard();
    });

    const initBoard = async () => {
        gameBoard = generateBoard(gameSetting.gameSize);
        winningCombinations = generateWinningCombinations(gameSetting.gameSize);
        bot = getBot(gameSetting.botLevel);
        gameFreezed = false;
        winner = undefined;
        winnerCombination = undefined;
        currentPlayer = PlayerType.PLAYER;
    };

    const generateBoard = (size: number): PlayerType[][] => {
        const board: PlayerType[][] = [];

        for (let i = 0; i < size; i++) {
            const row = new Array(size).fill(PlayerType.EMPTY);
            board.push(row);
        }

        return board;
    };

    const generateWinningCombinations = (size: number): number[][][] => {
        const combinations: number[][][] = [];

        // Rows
        for (let row = 0; row < size; row++) {
            const rowCombination = [];
            for (let col = 0; col < size; col++) {
                rowCombination.push([row, col]);
            }
            combinations.push(rowCombination);
        }

        // Columns
        for (let col = 0; col < size; col++) {
            const colCombination = [];
            for (let row = 0; row < size; row++) {
                colCombination.push([row, col]);
            }
            combinations.push(colCombination);
        }

        // Diagonal (top-left to bottom-right)
        const diagonal1 = [];
        for (let i = 0; i < size; i++) {
            diagonal1.push([i, i]);
        }
        combinations.push(diagonal1);

        // Diagonal (top-right to bottom-left)
        const diagonal2 = [];
        for (let i = 0; i < size; i++) {
            diagonal2.push([i, size - i - 1]);
        }
        combinations.push(diagonal2);

        return combinations;
    };

    const checkWinner = (
        board: PlayerType[][],
        playerType: PlayerType,
    ): PlayerType | undefined => {
        winnerCombination = winningCombinations.find((combination) =>
            combination.every(([x, y]) => board[x][y] === playerType),
        );
        return winnerCombination ? playerType : undefined;
    };

    const isDraw = (board: PlayerType[][]): boolean =>
        board.every((row) => row.every((cell) => cell !== PlayerType.EMPTY));

    const switchPlayer = (playerType: PlayerType) =>
        playerType == PlayerType.PLAYER ? PlayerType.BOT : PlayerType.PLAYER;

    const botTurn = async (board: PlayerType[][]) => {
        gameFreezed = true;
        await new Promise((f) => setTimeout(f, 500)); // Bot think
        gameFreezed = false;

        const [rowIndex, colIndex] = bot!!.selectCell(board);
        gameBoard!![rowIndex][colIndex] = PlayerType.BOT;

        processAfterCellClick();
    };

    const handleOnCellClick = (rowIndex: number, colIndex: number) => {
        if (
            gameBoard &&
            gameBoard[rowIndex][colIndex] === PlayerType.EMPTY &&
            !gameFreezed
        ) {
            gameBoard[rowIndex][colIndex] = PlayerType.PLAYER;

            processAfterCellClick();
        }
    };

    const alertAndInitBoard = async (message: string) => {
        await new Promise((f) => setTimeout(f, 250));
        alert(message);
        initBoard();
    };

    const processAfterCellClick = async () => {
        winner = checkWinner(gameBoard!!, currentPlayer);

        if (winner) {
            gameFreezed = true;
            dispatch("gameEnd", currentPlayer);

            if (currentPlayer === PlayerType.PLAYER) {
                alertAndInitBoard(
                    game.ownerNumberOfConsecutiveWins + 1 ==
                        gameSetting.consecutiveTarget
                        ? "Congraturation!, you got 1 bonus point, so the point has been +2 ^^"
                        : "You win!, the point has been +1",
                );
            } else {
                alertAndInitBoard(
                    game.ownerPoint > 0
                        ? "You lose!, the point has been -1"
                        : "You lose!",
                );
            }
        } else {
            const draw = isDraw(gameBoard!!);
            if (draw) {
                gameFreezed = true;
                dispatch("gameEnd");

                alertAndInitBoard("Draw!");
            } else {
                currentPlayer = switchPlayer(currentPlayer);
                if (currentPlayer === PlayerType.BOT) botTurn(gameBoard!!);
            }
        }
    };
</script>

{#if gameBoard}
    <div class="game-board" in:fade>
        {#each gameBoard as row, rowIndex}
            <div class="row">
                {#each row as cell, colIndex}
                    <button
                        class="cell {winnerCombination &&
                        winnerCombination.some((element) => {
                            const row = element[0];
                            const col = element[1];
                            return row == rowIndex && col == colIndex;
                        })
                            ? winner === PlayerType.PLAYER
                                ? 'owner-win'
                                : 'challenger-win'
                            : ''}"
                        type="button"
                        onclick={() => handleOnCellClick(rowIndex, colIndex)}
                    >
                        {#key cell}
                            <span transition:fade={{ duration: 200 }}
                                >{cell}</span
                            >
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

            &.owner-win {
                color: lightgreen;
            }
            &.challenger-win {
                color: lightcoral;
            }
        }
    }
</style>
