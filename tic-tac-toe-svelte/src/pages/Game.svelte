<script lang="ts">
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import Board from "../components/game/Board.svelte";
    import { getBot, type Bot } from "../services/bot.svelte";
    import {
        getGame,
        getGameConfig,
        PlayerType,
        processPoint,
        type GameSettingResponse,
        type GameResponse,
    } from "../services/game.svelte";
    import { logout, playerProfile } from "../services/player.svelte";
    import GameStatus from "../components/game/GameStatus.svelte";
    import GameSettings from "../components/game/GameSettings.svelte";

    const GAME_SIZE = 3;

    let bot: Bot;

    let gameEnd = false;
    let winner: PlayerType = PlayerType.EMPTY;

    let getGameConfigFunction: Promise<GameSettingResponse>;
    let getGameFunction: Promise<GameResponse>;

    let gameSetting: GameSettingResponse;
    let game: GameResponse;

    const handleOnGameEnd = async (event: any) => {
        gameEnd = true;
        winner = event.detail;

        game = await processPoint(game.id, winner);
    };

    onMount(async () => {
        if ($playerProfile) {
            getGameConfigFunction = getGameConfig($playerProfile.reference);
            getGameFunction = getGame($playerProfile.reference);
        }

        try {
            gameSetting = await getGameConfigFunction;
            game = await getGameFunction;

            if (gameSetting) bot = getBot(gameSetting.botLevel);
        } catch (error) {
            console.error(error);
        }
    });
</script>

{#if $playerProfile}
    <div class="header-container">
        <span class="player-profile-container">{$playerProfile.name}</span>
        <button type="button" class="logout-button" onclick={logout}>
            <span class="material-symbols-outlined"> logout </span>
            <span class="logout-text">Logout</span>
        </button>
    </div>
{/if}
<div class="game-panel-container">
    {#await getGameConfigFunction then}
        {#await getGameFunction then}
            <div class="game-panel">
                <div>
                    {#if game}
                        <div class="setting-contianer"><GameSettings bind:gameSetting/></div>
                        <GameStatus bind:gameSetting bind:game bind:winner />
                    {/if}
                </div>

                <div class="board-container">
                    <Board
                        {game}
                        {gameSetting}
                        gameSize={GAME_SIZE}
                        {bot}
                        on:gameEnd={handleOnGameEnd}
                    />
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
