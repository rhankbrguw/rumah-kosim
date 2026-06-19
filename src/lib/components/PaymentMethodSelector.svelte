<script lang="ts">
	export let methods: { id: string; label: string; icon: string; type: string }[];
	export let paymentMethod: string;
	export let showQR: boolean;
</script>

<div class="flex gap-3 sm:gap-4">
	{#each methods as m}
		<button
			type="button"
			class="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 p-3 transition-all sm:p-4
			{paymentMethod === m.id
				? 'border-primary bg-primary-light shadow-sm'
				: 'border-secondary/20 bg-surface-alt hover:border-primary/40'}"
			on:click={() => {
				paymentMethod = m.id;
				showQR = m.type === 'qr';
			}}
		>
			<img src={m.icon} alt={m.label} class="h-5 sm:h-6" />
			<span class="text-xs font-medium text-text-main sm:text-sm">{m.label}</span>
		</button>
	{/each}
</div>
