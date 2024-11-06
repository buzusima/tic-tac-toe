<script lang="ts">
    import Game from './pages/Game.svelte'
    import Login from './pages/Login.svelte'
    import { gameOwnerProfile } from './services/game-owner.svelte'
</script>

<main>
    {#if !$gameOwnerProfile}
        <Login />
    {:else}
        <Game />
    {/if}
</main>

<style>
</style>
