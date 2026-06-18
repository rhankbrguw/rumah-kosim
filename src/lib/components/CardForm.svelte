<script lang="ts">
		import { STRINGS } from '$lib/constants/strings';

	export let cardHolder: string = '';
	export let cardNumber: string = '';
	export let month: string = '';
	export let year: string = '';
	export let cvv: string = '';
	export let loading: boolean = false;

	const formatCard = (e: Event) =>
		(cardNumber = (e.target as HTMLInputElement).value
			.replace(/\D/g, '')
			.replace(/(\d{4})/g, '$1 ')
			.trim()
			.substring(0, 19));
</script>

<div class="space-y-4">
	<input
		type="text"
		bind:value={cardHolder}
		placeholder={STRINGS.CHECKOUT.PAYMENT.CARD_NAME}
		class="w-full rounded-md border border-secondary px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary"
		required
	/>
	<input
		type="text"
		bind:value={cardNumber}
		on:input={formatCard}
		placeholder={STRINGS.CHECKOUT.PAYMENT.CARD_NUMBER}
		class="w-full rounded-md border border-secondary px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary"
		required
	/>
	<div class="grid grid-cols-[1fr,1fr,100px] gap-4">
		<select bind:value={month} class="rounded-md border border-secondary px-4 py-3" required>
			<option value="">Month</option>
			{#each Array(12)
				.fill(0)
				.map((_, i) => i + 1) as m}
				<option value={m.toString().padStart(2, '0')}>{m.toString().padStart(2, '0')}</option>
			{/each}
		</select>
		<select bind:value={year} class="rounded-md border border-secondary px-4 py-3" required>
			<option value="">Year</option>
			{#each Array(10)
				.fill(0)
				.map((_, i) => new Date().getFullYear() + i) as y}
				<option value={y}>{y}</option>
			{/each}
		</select>
		<input
			type="text"
			bind:value={cvv}
			placeholder="CVV"
			maxlength="3"
			class="w-24 rounded-md border border-secondary px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary"
			required
		/>
	</div>
</div>
