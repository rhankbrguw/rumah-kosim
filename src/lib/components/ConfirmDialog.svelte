<script lang="ts">
	import { AlertTriangle } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { STRINGS } from '$lib/constants/strings.js';
	import ModalShell from './ModalShell.svelte';

	export let title: string;
	export let message: string;
	export let confirmLabel: string;
	export let isProcessing = false;

	const dispatch = createEventDispatcher();
</script>

<ModalShell
	{title}
	role="alertdialog"
	labelledBy="confirm-dialog-title"
	describedBy="confirm-dialog-message"
	showClose={!isProcessing}
	on:close={() => dispatch('cancel')}
>
	<div class="flex items-start gap-3">
		<div class="rounded-xl bg-danger-light p-2 text-danger" aria-hidden="true">
			<AlertTriangle size={20} />
		</div>
		<div class="min-w-0 flex-1">
			<p id="confirm-dialog-message" class="mt-1.5 text-sm leading-6 text-text-muted">
				{message}
			</p>
		</div>
	</div>
	<div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
		<button
			type="button"
			class="min-h-11 rounded-lg border border-secondary/30 bg-surface px-4 py-2 text-sm font-medium text-text-main transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-60"
			disabled={isProcessing}
			on:click={() => dispatch('cancel')}>{STRINGS.ADMIN.CONFIRM_DELETE.CANCEL}</button
		>
		<button
			type="button"
			class="min-h-11 rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-text-inverse transition-colors hover:bg-danger-hover disabled:cursor-not-allowed disabled:opacity-60"
			disabled={isProcessing}
			on:click={() => dispatch('confirm')}
		>
			{isProcessing ? STRINGS.ADMIN.CONFIRM_DELETE.PROCESSING : confirmLabel}
		</button>
	</div>
</ModalShell>
