<script lang="ts">
	import { ArrowRight, BookOpen, Sparkles, ShieldCheck, Truck } from 'lucide-svelte';
	import { STRINGS } from '$lib/constants/strings';
</script>

<section
	class="page-enter relative flex min-h-screen w-full items-center justify-center overflow-hidden pt-16 sm:pt-20"
>
	<img
		src={STRINGS.HERO.BG_IMAGE_URL}
		alt=""
		aria-hidden="true"
		class="absolute inset-0 z-0 h-full w-full object-cover object-center"
		width="1920"
		height="1080"
		fetchpriority="high"
		decoding="async"
	/>

	<div
		class="hero-overlay absolute inset-0 z-10 md:bg-gradient-to-r md:from-secondary/95 md:via-secondary/80 md:to-transparent"
	></div>

	<div class="container relative z-20 mx-auto px-4 py-12 sm:px-6 md:px-12 md:py-20 lg:px-16">
		<div
			class="reveal-up flex max-w-2xl flex-col items-center text-center md:items-start md:text-left lg:max-w-3xl"
		>
			<span
				class="text-micro mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-semibold text-primary backdrop-blur-md sm:mb-4 sm:text-xs"
			>
				<Sparkles size={13} />
				{STRINGS.HERO.BADGE}
			</span>

			<h1
				class="text-xl font-bold leading-snug tracking-tight text-text-inverse sm:text-3xl sm:leading-tight md:text-5xl lg:text-6xl"
			>
				{STRINGS.HERO.TITLE_PART_1} <br class="hidden sm:inline" />
				<span class="text-primary">{STRINGS.HERO.TITLE_HIGHLIGHT}</span>
				{STRINGS.HERO.TITLE_PART_2}
			</h1>

			<p
				class="mt-3 max-w-xl text-xs leading-relaxed text-surface-alt/90 sm:mt-4 sm:text-sm md:text-base lg:text-lg"
			>
				{STRINGS.HERO.SUBTITLE}
			</p>

			<div
				class="mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8 sm:gap-4 md:justify-start"
			>
				<a
					href="/client/shop"
					class="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-secondary shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-primary-hover active:scale-95 sm:px-7 sm:py-3 sm:text-sm md:text-base"
				>
					{STRINGS.HERO.CTA_BUTTON}
					<ArrowRight size={16} />
				</a>
				<a
					href="/client/about"
					class="inline-flex items-center gap-2 rounded-xl border border-surface-alt/30 bg-surface/10 px-5 py-2.5 text-xs font-semibold text-text-inverse backdrop-blur-md transition-colors hover:border-surface-alt/50 hover:bg-surface/20 sm:px-6 sm:py-3 sm:text-sm md:text-base"
				>
					<BookOpen size={16} />
					{STRINGS.HERO.SECONDARY_CTA}
				</a>
			</div>

			<div
				class="text-micro mt-8 flex flex-wrap items-center justify-center gap-4 border-t border-surface-alt/15 pt-5 text-surface-alt/80 sm:mt-12 sm:gap-6 sm:pt-6 sm:text-xs md:justify-start"
			>
				<div class="flex items-center gap-1.5">
					<ShieldCheck size={15} class="text-primary" />
					<span>{STRINGS.HERO.STAT_AUTH}</span>
				</div>
				<div class="flex items-center gap-1.5">
					<BookOpen size={15} class="text-primary" />
					<span>{STRINGS.HERO.STAT_TITLES}</span>
				</div>
				<div class="flex items-center gap-1.5">
					<Truck size={15} class="text-primary" />
					<span>{STRINGS.HERO.STAT_SHIPPING}</span>
				</div>
			</div>
		</div>
	</div>
</section>
