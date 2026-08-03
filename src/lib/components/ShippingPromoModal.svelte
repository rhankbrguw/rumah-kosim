<script lang="ts">
	import { fade } from 'svelte/transition';
	import { X } from 'lucide-svelte';
	import { EXTRA_STRINGS } from '$lib/constants/strings';

	export let isModalVisible: boolean = false;
</script>

{#if isModalVisible}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-text-main/60 backdrop-blur-md"
		transition:fade={{ duration: 150 }}
		on:click={() => (isModalVisible = false)}
		role="presentation"
	>
		<div
			class="relative w-[90%] max-w-xl rounded-xl bg-surface p-2 shadow-2xl sm:w-auto"
			on:click|stopPropagation
			role="presentation"
		>
			<button
				class="absolute -right-5 -top-5 z-50 rounded-full bg-danger p-3 text-text-inverse shadow-lg transition-transform hover:scale-110 hover:bg-danger-hover"
				on:click={() => (isModalVisible = false)}
				aria-label={EXTRA_STRINGS.SHIPPING_PROMO.CLOSE}
			>
				<X size={24} />
			</button>
			<img
				src="/images/banner-5.png"
				alt={EXTRA_STRINGS.SHIPPING_PROMO.ALT}
				class="w-full object-cover transition-transform duration-500 hover:scale-105"
			/>
		</div>
	</div>
{/if}
