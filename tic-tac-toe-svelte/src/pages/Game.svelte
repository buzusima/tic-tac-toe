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
    import { logout, playerProfile } from '../services/player.svelte'

    const GAME_SIZE = 3

    let bot: Bot

    let gameEnd = false
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
        if ($playerProfile) {
            getGameConfigFunction = getGameConfig($playerProfile.reference)
            getGameFunction = getGame($playerProfile.reference)
        }

        try {
            gameConfig = await getGameConfigFunction
            game = await getGameFunction

            if (gameConfig) bot = getBot(gameConfig.botLevel)
        } catch (error) {
            console.error(error)
        }
    })
</script>

{#if $playerProfile}
    <div class="header-container">
        <span class="player-profile-container">{$playerProfile.name}</span>
        <button type="button" class="logout-button" onclick={logout}>
            <span class="material-symbols-outlined"> logout </span> <span class="logout-text">Logout</span>
        </button>
    </div>
{/if}
<div class="game-panel-container">
    {#await getGameConfigFunction then}
        {#await getGameFunction then}
            <div class="game-panel">
                <div>
                    {#if game}
                        <div class="player-status-container">
                            You ({PlayerType.PLAYER})
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
                    <Board {game} {gameConfig} gameSize={GAME_SIZE} {bot} on:gameEnd={handleOnGameEnd} />
                </div>
            </div>
        {/await}
    {/await}
</div>

<style>
    .header-container {
        display: flex;
        justify-content: end;
        align-items: center;

        .logout-button {
            margin-left: 0.5rem;
            display: flex;
            gap: 0.2rem;
            align-items: center;

            .logout-text {
                display: inline;
            }

            @media (max-width: 600px) {
                .logout-text {
                    display: none;
                }
            }
        }
    }

    .game-panel-container {
        height: 80vh;
        display: grid;
        place-items: center;

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
        }
    }
</style>
