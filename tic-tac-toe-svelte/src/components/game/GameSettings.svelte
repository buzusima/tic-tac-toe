<script lang="ts">
    import { onMount } from "svelte";
    import type { GameSettingResponse } from "../../services/game.svelte";

    export let gameSetting: GameSettingResponse;

    onMount(() => {});
</script>

<button class="setting-button">
    <span class="material-symbols-outlined"> settings </span>
    <span class="setting-text">Settings</span>
</button>

<style>
    .setting-button {
        margin-left: 0.5rem;
        display: flex;
        gap: 0.2rem;
        align-items: center;
    }
</style>
