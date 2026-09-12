<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { StarIcon } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings';
	import { superForm } from 'sveltekit-superforms';
	import ModalShell from './ModalShell.svelte';

	import type { SuperValidated } from 'sveltekit-superforms';
	export let data: SuperValidated<{
		rating: number;
		comment: string;
		orderId: number;
		productId: number;
	}>;
	export let product: { id: number; title: string; image: string; orderId: number } | null = null;
	export let isOpen: boolean = false;

	const dispatch = createEventDispatcher();

	const { form, errors, enhance, message } = superForm(data, {
		onResult: ({ result }) => {
			if (result.type === 'success') {
				dispatch('close');
				setTimeout(() => {
					window.location.reload();
				}, 1000);
			}
		}
	});

	function close() {
		dispatch('close');
	}
</script>

{#if isOpen && product}
	<ModalShell
		isOpen={isOpen && !!product}
		title={`${STRINGS.PRODUCT.WRITE_REVIEW} ${product.title || STRINGS.COMMON.LOADING}`}
		on:close={close}
	>
		{#if $message}
			<div class="mt-4 rounded-lg bg-primary-light p-3 text-sm text-primary">{$message}</div>
		{/if}

		<form method="POST" action="?/review" use:enhance class="mt-6">
			<input type="hidden" name="productId" value={product.id} />
			<input type="hidden" name="orderId" value={product.orderId} />
			<input type="hidden" name="rating" value={$form.rating || 5} />

			<div class="mt-6">
				<p class="block text-sm font-medium text-text-main" id="rating-label">Rating</p>
				<div class="mt-2 flex gap-2" role="radiogroup" aria-labelledby="rating-label">
					{#each [1, 2, 3, 4, 5] as i (i)}
						<button
							type="button"
							class="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
							aria-label={`Rate ${i} stars`}
							aria-checked={$form.rating >= i}
							role="radio"
							on:click={() => ($form.rating = i)}
						>
							<StarIcon
								size={24}
								class={i <= ($form.rating || 5) ? 'text-primary' : 'text-secondary'}
							/>
						</button>
					{/each}
				</div>
				{#if $errors.rating}<span class="text-xs text-danger">{$errors.rating}</span>{/if}
			</div>

			<div class="mt-4">
				<label for="comment" class="block text-sm font-medium text-text-main">Comment</label>
				<textarea
					id="comment"
					name="comment"
					bind:value={$form.comment}
					class="mt-2 w-full rounded-lg border border-secondary p-3 text-text-main focus:border-primary focus:ring-2 focus:ring-primary"
					rows="4"
					placeholder={STRINGS.PRODUCT.REVIEW_PLACEHOLDER}
				></textarea>
				{#if $errors.comment}<span class="text-xs text-danger">{$errors.comment}</span>{/if}
			</div>

			<div class="mt-6 flex justify-end gap-3">
				<button
					type="button"
					on:click={close}
					class="rounded-lg bg-surface-alt px-4 py-2 text-text-main transition-colors hover:bg-secondary hover:text-text-inverse disabled:opacity-50"
				>
					{STRINGS.COMMON.CLOSE}
				</button>
				<button
					type="submit"
					class="rounded-lg bg-primary px-4 py-2 text-text-inverse transition-colors hover:bg-primary-hover disabled:opacity-50"
				>
					{STRINGS.COMMON.SAVE}
				</button>
			</div>
		</form>
	</ModalShell>
{/if}
