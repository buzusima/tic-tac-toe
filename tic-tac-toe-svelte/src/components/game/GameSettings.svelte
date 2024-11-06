<script lang="ts">
	import type { GameSettingResponse } from "../../services/game.svelte"
	import GameSettingModal from "./GameSettingModal.svelte"

	let { gameSetting = $bindable() }: { gameSetting: GameSettingResponse } =
		$props()

	let showModal = $state(false)
</script>

<button class="setting-button" onclick={() => (showModal = true)}>
	<span class="material-symbols-outlined"> settings </span>
	<span class="setting-text">Settings</span>
</button>

<GameSettingModal bind:showModal bind:gameSetting />

<style>
	.setting-button {
		margin-left: 0.5rem;
		display: flex;
		gap: 0.2rem;
		align-items: center;
	}
</style>
