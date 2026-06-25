<script lang="ts">
	import { auth, logout } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { STRINGS } from '$lib/constants/strings';
	import { UserCircle, LogIn } from 'lucide-svelte';

	let isAuthenticated = false,
		user: { username: string, role: string, avatar?: string } | null = null,
		isMobileMenuOpen = false;

	$: isHome = $page.url.pathname === '/';
	$: cartCount = $page.data.cartCount || 0;

	$: auth.subscribe(({ isAuthenticated: authState, user: userDetails }) => {
		isAuthenticated = authState;
		user = userDetails;
	});

	async function handleLogout() {
		localStorage.clear();
		await logout();
	}
</script>

<header
	class={`fixed top-0 z-[100] flex w-full flex-wrap items-center justify-between px-4 py-3 transition-colors md:px-6 md:py-4 ${
		isHome && !isMobileMenuOpen
			? 'border-b border-text-inverse/20 bg-transparent'
			: 'border-b border-surface-alt bg-surface/90 shadow-sm backdrop-blur-md'
	}`}
>
	<div class="flex items-center gap-x-2 text-primary md:gap-x-6">
		<button
			class={`mr-2 block md:hidden ${isHome ? 'text-text-inverse hover:text-primary' : 'text-text-muted hover:text-primary'}`}
			on:click={() => (isMobileMenuOpen = !isMobileMenuOpen)}
			aria-label="Toggle menu">☰</button
		>
		<a href="/" class="text-xl font-bold text-primary md:text-2xl">RumahKosimBook</a>
		<nav class="hidden gap-4 md:flex">
			<a
				href="/client/about"
				class={`text-sm ${isHome ? 'text-text-inverse/80 hover:text-text-inverse' : 'text-text-muted hover:text-primary'}`}
				>About</a
			>
			<a
				href="/client/shop"
				class={`text-sm ${isHome ? 'text-text-inverse/80 hover:text-text-inverse' : 'text-text-muted hover:text-primary'}`}
				>Shop</a
			>
		</nav>
	</div>

	<div class="flex items-center gap-2 md:gap-4">
		{#if isAuthenticated && user?.role !== 'admin'}
			<a
				href="/client/cart"
				class={isHome ? 'text-text-inverse' : 'text-text-main hover:text-primary'}
			>
				🛒 {cartCount}
			</a>
		{/if}

		{#if isAuthenticated}
			<div class="group relative hidden md:block">
				<div class="flex cursor-pointer items-center transition-transform hover:scale-110">
					<div class={isHome ? 'text-text-inverse/80 hover:text-text-inverse' : 'text-text-muted hover:text-primary'}>
						{#if user?.avatar}
							<img src={user.avatar} alt="Avatar" class="h-8 w-8 rounded-full object-cover shadow-sm border border-surface-alt" />
						{:else}
							<UserCircle size={28} strokeWidth={1.5} />
						{/if}
					</div>
				</div>
				<div
					class="absolute right-0 hidden w-48 rounded-md border border-surface-alt bg-surface shadow-md group-hover:block"
				>
					<a
						href="/client/profile"
						class="block px-4 py-2 text-sm text-text-muted hover:bg-surface-alt hover:text-primary"
					>
						👤 Profile
					</a>
					<a
						href={user?.role === 'admin' ? '/admin' : '/client/profile/history'}
						class="block px-4 py-2 text-sm text-text-muted hover:bg-surface-alt hover:text-primary"
					>
						{user?.role === 'admin' ? '⚙️ Settings' : '📜 History'}
					</a>
					<button
						on:click={handleLogout}
						class="block w-full cursor-pointer px-4 py-2 text-left text-sm text-danger hover:bg-danger-light hover:text-danger-hover"
					>
						Logout
					</button>
				</div>
			</div>
		{:else}
			<div class="hidden gap-2 md:flex md:gap-4">
				<a
					href="/client/auth"
					class={`flex items-center gap-1 text-sm font-semibold md:text-base transition-transform hover:scale-110 ${isHome ? 'text-text-inverse/80 hover:text-text-inverse' : 'text-text-muted hover:text-primary'}`}
					aria-label="Account"
					title="Login or Register"
				>
					<LogIn size={28} strokeWidth={1.5} />
				</a>
			</div>
		{/if}
	</div>

	<div
		class={`w-full border-t border-surface-alt md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
	>
		<nav class="flex flex-col py-2">
			<a href="/client/about" class="px-4 py-2 text-sm text-text-muted hover:text-primary">About</a>
			<a href="/client/shop" class="px-4 py-2 text-sm text-text-muted hover:text-primary">Shop</a>
			{#if !isAuthenticated}
				<a href="/client/auth" class="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-primary"
					><LogIn size={20} /> Auth</a
				>
			{:else}
				<a href="/client/profile" class="px-4 py-2 text-sm text-text-muted hover:text-primary">
					👤 Profile
				</a>
				<a href={user?.role === 'admin' ? '/admin' : '/client/profile/history'} class="px-4 py-2 text-sm text-text-muted hover:text-primary">
					{user?.role === 'admin' ? '⚙️ Settings' : '📜 History'}
				</a>
				<button on:click={handleLogout} class="w-full cursor-pointer px-4 py-2 text-left text-sm text-danger hover:text-danger-hover">
					Logout
				</button>
			{/if}
		</nav>
	</div>
</header>
