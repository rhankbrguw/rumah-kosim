<script lang="ts">
	import imageSrc from '$lib/assets/image/banner-4.png';
	import { STRINGS } from '$lib/constants/strings';

	export let title: string = STRINGS.ABOUT.TITLE;
	export let description: string[] = STRINGS.ABOUT.DESCRIPTION;
</script>

<section
	class="flex flex-col items-center gap-4 rounded-2xl border border-surface-alt/50 bg-surface/80 px-4 py-8 shadow-sm backdrop-blur-md sm:gap-6 sm:px-6 sm:py-12 lg:w-full lg:flex-row lg:items-center lg:gap-8 lg:px-8 lg:py-16"
>
	<img
		src={imageSrc}
		alt={STRINGS.ABOUT.IMAGE_ALT}
		class="h-32 w-32 rounded-full border border-secondary object-cover shadow-sm sm:h-40 sm:w-40 md:h-48 md:w-48 lg:h-56 lg:w-56"
	/>

	<div class="flex-1 text-center lg:text-left">
		<h2 class="mb-4 text-2xl font-bold text-text-main sm:mb-6 sm:text-3xl">
			{title}
		</h2>

		<div class="space-y-4">
			{#each description as paragraph}
				<p class="text-base leading-relaxed text-text-muted sm:text-lg">
					{paragraph}
				</p>
			{/each}
		</div>
	</div>
</section>
