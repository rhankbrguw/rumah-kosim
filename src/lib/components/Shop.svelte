<script lang="ts">
		import { goto } from '$app/navigation';
	import { Search, X, Star } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { auth } from '$lib/stores/auth';
	import { STRINGS } from '$lib/constants/strings.js';
	import { formatIDR } from '$lib/utils/currency.js';

	export let books: { id: number, title: string, description: string, price: number, image: string, sold_count: number, average_rating: number }[] = [];
	export let loading: boolean = true;
	let searchTerm = '';
	let showModal = false;

	onMount(() => {
		if ($auth.isAuthenticated && !$auth.isAdmin) {
			const userId = $auth.user?.id;
			if (!localStorage.getItem(`hasSeenShippingModal_${userId}`)) {
				showModal = true;
				localStorage.setItem(`hasSeenShippingModal_${userId}`, 'true');
			}
		}
	});

	const goToProduct = (id: number) => goto(`/client/products/${id}`);

	$: filteredBooks = books.filter(
		(b) =>
			b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			b.description.toLowerCase().includes(searchTerm.toLowerCase())
	);
</script>

{#if showModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-text-main/60 backdrop-blur-md"
		transition:fade={{ duration: 150 }}
		on:click={() => (showModal = false)}
		role="presentation"
	>
		<div
			class="relative w-[90%] max-w-xl rounded-xl bg-surface p-2 shadow-2xl sm:w-auto"
			on:click|stopPropagation
			role="presentation"
		>
			<button
				class="absolute -right-5 -top-5 z-50 rounded-full bg-danger p-3 text-text-inverse shadow-lg transition-transform hover:scale-110 hover:bg-danger-hover"
				on:click={() => (showModal = false)}
				aria-label="Close modal"
			>
				<X size={24} />
			</button>
			<img
				src="/images/banner-5.png"
				alt="Free Shipping Promo"
				class="w-full object-cover transition-transform duration-500 hover:scale-105"
			/>
		</div>
	</div>
{/if}

<section class="mt-16 p-4 sm:mt-20 sm:p-24 sm:px-4 sm:py-4">
	<div class="relative mb-4 sm:mb-6">
		<div class="relative">
			<input
				type="text"
				class="w-full rounded-xl border border-surface-alt/50 bg-surface/80 px-4 py-3 pl-11 text-text-main shadow-sm backdrop-blur-md transition-all focus:border-primary focus:bg-surface focus:ring-1 focus:ring-primary md:w-80"
				placeholder={STRINGS.SHOP.SEARCH_PLACEHOLDER}
				bind:value={searchTerm}
			/>
			<div class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
				<Search size={20} />
			</div>
		</div>
	</div>

	{#if loading}
		<div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
			{#each Array(8) as i}
				<div
					data-skeleton={i}
					class="flex h-full flex-col overflow-hidden rounded-2xl border border-surface-alt/50 bg-surface/70 shadow-sm backdrop-blur-md"
				>
					<div class="aspect-[4/5] w-full animate-pulse bg-surface-alt/80"></div>
					<div class="flex flex-1 flex-col p-4 sm:p-5">
						<div class="mb-2 h-5 w-3/4 animate-pulse rounded bg-surface-alt"></div>
						<div class="mb-4 h-4 w-1/2 animate-pulse rounded bg-surface-alt"></div>
						<div class="mt-auto h-10 w-full animate-pulse rounded-xl bg-surface-alt"></div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-1 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
			{#each filteredBooks as book (book.id)}
				<div
					class="group flex h-full flex-col overflow-hidden rounded-2xl border border-surface-alt/50 bg-surface/80 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-surface/95 hover:shadow-xl"
				>
					<div
						class="relative aspect-[4/5] w-full cursor-pointer overflow-hidden bg-surface-alt/50"
						on:click={() => goToProduct(book.id)}
						on:keydown={(e) => e.key === 'Enter' && goToProduct(book.id)}
						role="button"
						tabindex="0"
					>
						<img
							src={book.image}
							alt={book.title}
							class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
							on:error={(e) => ((e.target as HTMLImageElement).src = STRINGS.SHOP.FALLBACK_IMAGE)}
							loading="lazy"
						/>
					</div>
					<div class="flex flex-1 flex-col p-4 sm:p-5">
						<div class="flex-1">
							<h3 class="line-clamp-2 text-base font-bold text-text-main sm:text-lg">
								{book.title}
							</h3>
							<p class="mt-1 text-sm font-semibold text-danger sm:text-base">
								{formatIDR(book.price)}
							</p>
							<div class="mt-2 flex items-center gap-1.5">
								<div class="flex items-center text-primary">
									<Star size={14} fill="currentColor" />
									<span class="ml-1 text-xs font-bold text-text-main">{Number(book.average_rating || 0).toFixed(1)}</span>
								</div>
								<span class="text-xs text-text-muted">• {book.sold_count || 0} sold</span>
							</div>
						</div>

						<div class="mt-4 border-t border-surface-alt/50 pt-4">
							<button
								class="w-full rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary transition-colors duration-300 hover:bg-primary hover:text-text-inverse"
								on:click={() => goToProduct(book.id)}
							>
								{STRINGS.SHOP.SHOW_MORE}
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>
