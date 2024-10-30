<script lang="ts">
    import Game from './pages/Game.svelte'
    import Login from './pages/Login.svelte'
    import { playerProfile } from './services/player.svelte'
</script>

<main>
    {#if !$playerProfile}
        <Login />
    {:else}
        <Game />
    {/if}
</main>

<style>
</style>
