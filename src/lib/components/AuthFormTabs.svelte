<script lang="ts">
	import { STRINGS } from '$lib/constants/strings';
	import { fade } from 'svelte/transition';

	export let viewMode: 'login' | 'signup' | 'otp' | 'forgot_password';
</script>

{#if viewMode === 'login' || viewMode === 'signup'}
	<div
		class="mb-8 grid w-full grid-cols-2 rounded-xl bg-surface-alt/50 p-1 backdrop-blur-sm"
		in:fade={{ duration: 300 }}
	>
		<button
			type="button"
			class={`relative rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${
				viewMode === 'login'
					? 'bg-surface text-primary shadow-sm ring-1 ring-secondary/10'
					: 'text-text-muted hover:text-text-main'
			}`}
			on:click={() => {
				viewMode = 'login';
			}}
		>
			{STRINGS.AUTH.LOGIN.TITLE}
		</button>
		<button
			type="button"
			class={`relative rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${
				viewMode === 'signup'
					? 'bg-surface text-primary shadow-sm ring-1 ring-secondary/10'
					: 'text-text-muted hover:text-text-main'
			}`}
			on:click={() => {
				viewMode = 'signup';
			}}
		>
			{STRINGS.AUTH.SIGNUP.TITLE}
		</button>
	</div>
{/if}
