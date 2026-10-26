<script lang="ts">
	import { EXTRA_STRINGS } from '$lib/constants/strings';
	import ModalShell from './ModalShell.svelte';

	export let isModalVisible: boolean = false;
</script>

{#if isModalVisible}
	<ModalShell
		on:close={() => (isModalVisible = false)}
		ariaLabel={EXTRA_STRINGS.SHIPPING_PROMO.CLOSE}
	>
		<img
			src="/images/banner-5.png"
			alt={EXTRA_STRINGS.SHIPPING_PROMO.ALT}
			class="w-full rounded-xl object-cover transition-transform duration-300 hover:scale-[1.01]"
		/>
	</ModalShell>
{/if}
