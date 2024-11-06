<script lang="ts">
    import { onMount } from "svelte";
    import { type Bot } from "../bots/bot";
    import Board from "../components/game/Board.svelte";
    import GameSettings from "../components/game/GameSettings.svelte";
    import GameStatus from "../components/game/GameStatus.svelte";
    import {
        getGame,
        getGameSetting,
        PlayerType,
        processPoint,
        type GameResponse,
        type GameSettingResponse,
    } from "../services/game.svelte";
    import { logout, gameOwnerProfile } from "../services/game-owner.svelte";

    let bot = $state<Bot>();

    let gameEnd = false;
    let winner = $state<PlayerType>(PlayerType.EMPTY);

    let getGameSettingFunction = $state<Promise<GameSettingResponse>>();
    let getGameFunction = $state<Promise<GameResponse>>();

    let gameSetting = $state<GameSettingResponse>();
    let game = $state<GameResponse>();

    let board = $state<Board>();

    const handleOnGameEnd = async (event: any) => {
        gameEnd = true;
        winner = event.detail;

        game = await processPoint(game!!.id, winner);
    };

    onMount(async () => {
        if ($gameOwnerProfile) {
            getGameSettingFunction = getGameSetting($gameOwnerProfile.reference);
            getGameFunction = getGame($gameOwnerProfile.reference);
        }

        try {
            gameSetting = await getGameSettingFunction;
            game = await getGameFunction;
        } catch (error) {
            console.error(error);
        }
    });
</script>

{#if $gameOwnerProfile}
    <div class="header-container">
        <span class="player-profile-container">{$gameOwnerProfile.name}</span>
        <button type="button" class="logout-button" onclick={logout}>
            <span class="material-symbols-outlined"> logout </span>
            <span class="logout-text">Logout</span>
        </button>
    </div>
{/if}
<div class="game-panel-container">
    {#await getGameSettingFunction then}
        {#await getGameFunction then}
            {#if gameSetting && game}
                <div class="game-panel">
                    {#if game}
                        <div>
                            <div class="setting-contianer">
                                <GameSettings bind:gameSetting />
                            </div>
                            <GameStatus
                                bind:gameSetting
                                bind:game
                                bind:winner
                            />
                        </div>
                        <div class="board-container">
                            <Board
                                bind:this={board}
                                {game}
                                bind:gameSetting
                                on:gameEnd={handleOnGameEnd}
                            />
                        </div>
                    {/if}
                </div>
            {/if}
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

            .setting-contianer {
                display: flex;
                justify-content: end;
                margin-top: 0.625rem;
            }

            .board-container {
                margin-top: 3rem;
                /* height: 15rem;
                width: 15rem;
                display: flex; */
            }
        }
    }
</style>
