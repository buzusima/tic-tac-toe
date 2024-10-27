<script lang="ts">
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import Board from '../components/game/Board.svelte'
    import { getBot, type Bot } from '../services/bot.svelte'
    import {
        getGame,
        getGameConfig,
        PlayerType,
        processPoint,
        type GameConfigResponse,
        type GameResponse,
    } from '../services/game.svelte'

    const GAME_SIZE = 3
    const MOCK_PLAYER_ID = 'MOCK_PLAYER_ID'

    let board: Board
    let bot: Bot

    let gameEnd = false
    let currentPlayer: PlayerType = PlayerType.PLAYER
    let winner: PlayerType = PlayerType.EMPTY

    let getGameConfigFunction: Promise<GameConfigResponse>
    let getGameFunction: Promise<GameResponse>

    let gameConfig: GameConfigResponse
    let game: GameResponse

    const handleOnGameEnd = async (event: any) => {
        gameEnd = true
        winner = event.detail

        game = await processPoint(game.id, winner)
    }

    onMount(async () => {
        getGameConfigFunction = getGameConfig(MOCK_PLAYER_ID)
        getGameFunction = getGame(MOCK_PLAYER_ID)

        try {
            gameConfig = await getGameConfigFunction
            game = await getGameFunction

            if (gameConfig) bot = getBot(gameConfig.botLevel)
        } catch (error) {
            console.error(error)
        }
    })
</script>

{#await getGameConfigFunction then}
    {#await getGameFunction then}
        <div class="game-panel">
            <div>
                {#if game}
                    <div class="player-status-container">
                        Player ({PlayerType.PLAYER})
                        <div class="player-point-container {winner === PlayerType.PLAYER ? 'win' : ''}">
                            {#key game.playerPoint}
                                Point: <span in:fade={{ duration: 1000 }}>{game.playerPoint}</span>
                            {/key}

                            <div class="consecutive-container">
                                Consecutive Wins:
                                {#each { length: game.playerNumberOfConsecutiveWins } as _, i}
                                    <div class="consecutive-current" in:fade></div>
                                {/each}

                                {#if gameConfig}
                                    {#each { length: gameConfig.consecutiveTarget - game.playerNumberOfConsecutiveWins } as _, i}
                                        <div class="consecutive-target"></div>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    </div>
                    <div class="bot-status-container">
                        <span>
                            Bot ({PlayerType.BOT})
                        </span>
                        <div class="bot-point-container {winner === PlayerType.BOT ? 'win' : ''}">
                            Point: {game.botPoint}
                        </div>
                    </div>
                {/if}
            </div>

            <div class="board-container">
                <Board bind:this={board} gameSize={GAME_SIZE} {bot} bind:currentPlayer on:gameEnd={handleOnGameEnd} />
            </div>

            <div class="control">
                {#if gameEnd}
                    <button
                        onclick={() => {
                            gameEnd = false
                            winner = PlayerType.EMPTY
                            board.resetBoard()
                        }}
                        in:fade>Play Again</button
                    >
                {/if}
            </div>
        </div>
    {/await}
{/await}

<style>
    .game-panel {
        display: flex;
        flex-direction: column;
        align-items: center;

        .player-status-container {
            color: lightgreen;

            .player-point-container {
                border: 0.125rem solid gray;
                border-radius: 0.4rem;
                padding: 0.313rem;
                &.win {
                    border: 0.125rem solid lightgreen;
                }
            }

            .consecutive-container {
                display: flex;
                gap: 0.5rem;
                align-items: center;
                justify-content: center;

                .consecutive-current {
                    width: 0.5rem;
                    height: 1rem;
                    background-color: aqua;
                    border: 0.125rem solid aqua;
                    border-radius: 0.2rem;
                }
                .consecutive-target {
                    width: 0.5rem;
                    height: 1rem;
                    border: 0.125rem solid aqua;
                    border-radius: 0.2rem;
                }
            }
        }

        .bot-status-container {
            margin-top: 0.625rem;
            color: lightcoral;

            .bot-point-container {
                border: 0.125rem solid gray;
                border-radius: 0.4rem;
                padding: 0.313rem;
                &.win {
                    border: 0.125rem solid lightcoral;
                }
            }
        }

        .board-container {
            height: 15rem;
            width: 15rem;
            display: flex;
        }

        .control {
            min-height: 2.5rem;
        }
    }
</style>
