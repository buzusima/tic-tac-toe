<script lang="ts">
	import { BotLevel } from "../../bots/bot"
	import { ChallengerType } from "../../datasources/data-provider"
	import {
		setGameSetting,
		type GameSettingResponse,
	} from "../../services/game.svelte"

	let {
		showModal = $bindable(),
		gameSetting = $bindable(),
	}: {
		showModal: boolean
		gameSetting: GameSettingResponse
	} = $props()

	let dialog = $state<HTMLDialogElement>()

	$effect(() => {
		if (showModal) dialog?.showModal()
	})

	const handleSubmit = async (event: {
		currentTarget: EventTarget & HTMLFormElement
	}) => {
		const data = new FormData(event.currentTarget)

		const challenger: ChallengerType = Number(data.get("challenger"))
		const botLevel: BotLevel = Number(data.get("botLevel"))
		const gameSize: number = Number(data.get("gameSize"))

		gameSetting = await setGameSetting(
			gameSetting.id,
			challenger,
			botLevel,
			gameSize
		)
		dialog?.close()
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<dialog
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click={(e) => {
		if (e.target === dialog) dialog.close()
	}}
>
	<div>
		<h1>Settings</h1>
		<!-- svelte-ignore event_directive_deprecated -->
		<form on:submit|preventDefault={handleSubmit}>
			<p>Select chanllenger:</p>
			<input
				type="radio"
				id="bot"
				name="challenger"
				bind:group={gameSetting.challengerType}
				value={ChallengerType.BOT}
				checked
			/>
			<label for="bot">BOT</label><br />
			<div class="bot-level-container">
				<input
					type="radio"
					id="random-bot"
					name="botLevel"
					disabled={gameSetting.challengerType !== ChallengerType.BOT}
					bind:group={gameSetting.botLevel}
					value={BotLevel.EASY}
				/>
				<label for="random-bot">Easy</label><br />
				<input
					type="radio"
					id="logic-bot"
					name="botLevel"
					disabled={gameSetting.challengerType !== ChallengerType.BOT}
					bind:group={gameSetting.botLevel}
					value={BotLevel.MEDIUM}
				/>
				<label for="logic-bot">Medium</label><br />
			</div>
			<input
				type="radio"
				id="player"
				name="challenger"
				bind:group={gameSetting.challengerType}
				value={ChallengerType.PLAYER}
			/>
			<label for="player">Player</label><br /><br />
			<label for="game-size">Game size:</label>
			<input
				type="number"
				id="game-size"
				name="gameSize"
				value={gameSetting.gameSize}
				max="5"
				min="3"
			/>

			<br />
			<div class="submit-button-container">
				<input type="submit" value="Save" />
			</div>
		</form>
	</div>
</dialog>

<style>
	dialog {
		padding: 0rem 3rem 2rem 3rem;
		border-radius: 0.375rem;
		border: none;

		.bot-level-container {
			padding-left: 1rem;
		}
		.submit-button-container {
			display: flex;
			justify-content: end;
			margin-top: 2rem;
		}
	}
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}
	dialog > div {
		padding: 1em;
	}
	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
