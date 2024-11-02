<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import {
        PlayerType,
        type GameSettingResponse,
        type GameResponse,
    } from "../../services/game.svelte";

    export let gameSetting: GameSettingResponse;
    export let game: GameResponse;
    export let winner: PlayerType;

    onMount(() => {});
</script>

<div class="player-status-container">
    You ({PlayerType.PLAYER})
    <div
        class="player-point-container {winner === PlayerType.PLAYER
            ? 'win'
            : ''}"
    >
        {#key game.playerPoint}
            Point: <span in:fade={{ duration: 1000 }}>{game.playerPoint}</span>
        {/key}

        <div class="consecutive-container">
            Consecutive Wins:
            {#each { length: game.playerNumberOfConsecutiveWins } as _, i}
                <div class="consecutive-current" in:fade></div>
            {/each}

            {#if gameSetting}
                {#each { length: gameSetting.consecutiveTarget - game.playerNumberOfConsecutiveWins } as _, i}
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

<style>
    .player-status-container {
        color: lightgreen;

        .player-point-container {
            border: 0.125rem solid gray;
            border-radius: 0.4rem;
            padding: 0.313rem 5rem 0.313rem 1rem;
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
            padding: 0.313rem 5rem 0.313rem 1rem;
            &.win {
                border: 0.125rem solid lightcoral;
            }
        }
    }
</style>
