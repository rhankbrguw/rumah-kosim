<script lang="ts">
		import { Search } from 'lucide-svelte';
</script>

<section
	class="relative flex h-screen flex-col items-center justify-center overflow-hidden pt-8 text-center"
>
	<!-- Background image -->
	<div class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-[url('/images/bg-ruko.png')]"></div>

	<!-- Original blur overlay -->
	<div class="absolute inset-0 z-10 backdrop-blur-sm"></div>

	<div class="z-50 px-4">
		<h1 class="z-[100] text-3xl font-bold text-text-inverse md:text-5xl">
			Books are the windows to the world, and <br />
			<span class="text-primary">RumahKosimBook</span> is the door that invites you in.
		</h1>
		<p class="mt-6 text-lg text-surface-alt">
			Discover your favorite stories and treasures at RumahKosimBook—
		</p>
		<a
			href="/client/shop"
			class="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-center font-bold text-secondary shadow-lg transition-transform hover:-translate-y-1 hover:bg-primary-hover"
		>
			Explore Us <Search size={20} />
		</a>
	</div>

	<!-- Background decorations -->
	<div
		class="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-surface via-transparent to-transparent"
	></div>
</section>
