<script lang="ts">
    import { onMount } from "svelte";
    import { authProviders } from "../authProviders/auth";
    import {
        getGameOwnerProfile,
        gameOwnerProfile,
    } from "../services/game-owner.svelte";

    const GOOGLE_CLIENT_ID = import.meta.env.OAUTH_GOOGLE_CLIENT_ID;

    onMount(() => {
        const pProfile = getGameOwnerProfile();
        if (pProfile) {
            gameOwnerProfile.set(pProfile);
        } else {
            if (GOOGLE_CLIENT_ID)
                authProviders.google.initialize(
                    GOOGLE_CLIENT_ID,
                    "signInButton",
                );
        }
    });
</script>

<div class="login-page">
    <div class="login-content">
        <h1 class="tic-tac-toe-title">Welcome to Tic Tac Toe Arena!</h1>
        <p>
            Log in to save your game profile, track your scores, and aim for
            consecutive wins! Achieve three consecutive wins to earn a bonus
            point, then watch as your streak resets to start the challenge
            again.
        </p>
        <p>
            Ready to become the ultimate Tic Tac Toe champion? <strong
                >Sign in now</strong
            > to start recording your progress!
        </p>
        <div class="sign-in-button">
            {#if GOOGLE_CLIENT_ID}
                <div id="signInButton"></div>
            {:else}
                <h1 class="text-red-color">
                    Cannot login! No provider config, please check the config
                    file.
                </h1>
            {/if}
        </div>
    </div>
</div>

<style>
    .login-page {
        height: 80vh;
        display: grid;
        place-items: center;
        text-align: center;

        .tic-tac-toe-title {
            font-size: 2rem;
        }

        @media (max-width: 600px) {
            .tic-tac-toe-title {
                font-size: 1.5rem;
            }
        }

        .sign-in-button {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 2rem;
        }

        .text-red-color {
            color: tomato;
        }
    }
    @media (max-width: 600px) {
        .login-page {
            padding: 0rem 1rem;
        }
    }
</style>
