<script lang="ts">
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import { RandomBot } from '../bots/random'
    import Board from '../components/game/Board.svelte'
    import {
        botPoint,
        CONSECUTIVE_TARGET,
        consecutiveWins,
        GamePlayerEnum,
        playerPoint,
        processConsecutiveWin,
        processPoint,
    } from '../services/game.svelte'

    const GAME_SIZE = 3

    let board: Board
    let bot: RandomBot

    let gameEnd = false
    let currentPlayer: GamePlayerEnum = GamePlayerEnum.PLAYER
    let winner: GamePlayerEnum = GamePlayerEnum.EMPTY
    let bonus = false

    const handleOnGameEnd = (event: any) => {
        gameEnd = true
        winner = event.detail

        processConsecutiveWin(winner)
        if ($consecutiveWins == CONSECUTIVE_TARGET) {
            bonus = true
        }

        processPoint(winner)
    }

    onMount(() => {
        //TODO: Read from game config
        bot = new RandomBot()
    })
</script>

<div class="game-panel">
    <div>
        <div class="player-status-container">
            Player ({GamePlayerEnum.PLAYER})
            <div class="player-point-container {winner === GamePlayerEnum.PLAYER ? 'win' : ''}">
                {#key $playerPoint}
                    Point: <span in:fade={{ duration: 1000 }}>{$playerPoint}</span>
                {/key}

                <div class="consecutive-container">
                    Consecutive Wins:
                    {#each { length: $consecutiveWins } as _, i}
                        <div class="consecutive-current" in:fade></div>
                    {/each}

                    {#each { length: CONSECUTIVE_TARGET - $consecutiveWins } as _, i}
                        <div class="consecutive-target"></div>
                    {/each}
                </div>
            </div>
        </div>
        <div class="bot-status-container">
            <span>
                Bot ({GamePlayerEnum.BOT})
            </span>
            <div class="bot-point-container {winner === GamePlayerEnum.BOT ? 'win' : ''}">Point: {$botPoint}</div>
        </div>
    </div>

    <div class="board-container">
        <Board bind:this={board} gameSize={GAME_SIZE} {bot} bind:currentPlayer on:gameEnd={handleOnGameEnd} />
    </div>

    <div class="control">
        {#if gameEnd}
            <button
                onclick={() => {
                    gameEnd = false
                    winner = GamePlayerEnum.EMPTY
                    bonus = false
                    board.resetBoard()
                }}
                in:fade>Play Again</button
            >
        {/if}
    </div>
</div>

<style>
    .game-panel {
        display: flex;
        flex-direction: column;
        align-items: center;

        .player-status-container {
            color:lightgreen;

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
