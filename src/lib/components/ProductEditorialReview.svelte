<script lang="ts">
	import { STRINGS } from '$lib/constants/strings.js';
	export let review: { headline: string; body: string };
</script>

<div class="mx-auto mt-16 max-w-5xl border-t border-secondary/10 pt-12 md:mt-20 md:pt-16">
	<h2 class="mb-6 text-2xl font-bold text-text-main md:text-3xl">
		{STRINGS.PRODUCT.EDITORIAL_REVIEWS}
	</h2>
	<div class="flex flex-col gap-6 md:flex-row md:gap-12">
		<div class="md:w-1/3">
			<p class="whitespace-pre-line text-lg font-bold text-primary">
				{review.headline}
			</p>
		</div>
		<div class="md:w-2/3">
			<p class="whitespace-pre-line text-lg leading-relaxed text-text-muted">
				{review.body}
			</p>
		</div>
	</div>
</div>
