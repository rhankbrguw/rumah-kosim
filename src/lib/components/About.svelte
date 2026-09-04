<script lang="ts">
	import imageSrc from '$lib/assets/image/banner-4.png';
	import { STRINGS } from '$lib/constants/strings';

	export let title: string = STRINGS.ABOUT.TITLE;
	export let description: string[] = STRINGS.ABOUT.DESCRIPTION;
</script>

<section
	class="page-enter flex flex-col items-center gap-4 rounded-xl border border-surface-alt/60 bg-surface/90 p-4 shadow-sm backdrop-blur-md sm:rounded-2xl sm:p-6 lg:w-full lg:flex-row lg:items-center lg:gap-8 lg:p-10"
>
	<img
		src={imageSrc}
		alt={STRINGS.ABOUT.IMAGE_ALT}
		class="h-28 w-28 shrink-0 rounded-full border border-surface-alt object-cover shadow-sm sm:h-36 sm:w-36 md:h-44 md:w-44"
	/>

	<div class="flex-1 text-center lg:text-left">
		<h2 class="mb-3 text-lg font-bold text-text-main sm:mb-4 sm:text-2xl lg:text-3xl">
			{title}
		</h2>

		<div class="space-y-2.5 sm:space-y-3.5">
			{#each description as paragraph, idx (idx)}
				<p class="text-xs leading-relaxed text-text-muted sm:text-sm lg:text-base">
					{paragraph}
				</p>
			{/each}
		</div>
	</div>
</section>
