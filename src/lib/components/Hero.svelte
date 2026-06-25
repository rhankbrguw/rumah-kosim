<script lang="ts">
	import { Search } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings';
</script>

<section
	class="relative flex h-screen flex-col items-center justify-center overflow-hidden pt-8 text-center"
>
	<div
		class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
		style="background-image: url('{STRINGS.HERO.BG_IMAGE_URL}');"
	></div>

	<div class="absolute inset-0 z-10 backdrop-blur-sm"></div>

	<div class="z-50 px-4">
		<h1 class="text-3xl font-bold text-text-inverse md:text-5xl relative z-50">
			{STRINGS.HERO.TITLE_PART_1} <br />
			<span class="text-primary">{STRINGS.HERO.TITLE_HIGHLIGHT}</span>
			{STRINGS.HERO.TITLE_PART_2}
		</h1>
		<p class="mt-6 text-lg text-surface-alt">
			{STRINGS.HERO.SUBTITLE}
		</p>
		<a
			href="/client/shop"
			class="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-center font-bold text-secondary shadow-lg transition-transform hover:-translate-y-1 hover:bg-primary-hover"
		>
			{STRINGS.HERO.CTA_BUTTON} <Search size={20} />
		</a>
	</div>

	<div
		class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-surface via-transparent to-transparent"
	></div>
</section>
