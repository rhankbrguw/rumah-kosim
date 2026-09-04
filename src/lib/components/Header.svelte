<script lang="ts">
	import { logout } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import { LogIn, ShoppingCart, Menu, X } from 'lucide-svelte';
	import HeaderMobileMenu from './HeaderMobileMenu.svelte';
	import HeaderDesktopUserMenu from './HeaderDesktopUserMenu.svelte';
	import { STRINGS } from '$lib/constants/strings';

	let isMobileMenuOpen = false;

	$: isHome = $page.url.pathname === '/';
	$: cartCount = $page.data.cartCount || 0;
	$: user = $page.data.user;
	$: isAuthenticated = !!user;

	async function handleLogout() {
		localStorage.clear();
		await logout();
		isMobileMenuOpen = false;
	}
</script>

<header
	class={`fixed top-0 z-50 flex w-full flex-wrap items-center justify-between px-3.5 py-2.5 transition-colors sm:px-6 sm:py-3.5 ${
		isHome && !isMobileMenuOpen
			? 'border-b border-text-inverse/20 bg-transparent'
			: 'border-b border-surface-alt bg-surface/90 shadow-sm backdrop-blur-md'
	}`}
>
	<div class="flex items-center gap-x-2 text-primary md:gap-x-6">
		<button
			class={`mr-1.5 block flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg md:hidden ${
				isHome && !isMobileMenuOpen
					? 'text-text-inverse hover:text-primary'
					: 'text-text-muted hover:text-primary'
			}`}
			on:click={() => (isMobileMenuOpen = !isMobileMenuOpen)}
			aria-label={STRINGS.NAVIGATION.TOGGLE_MENU}
			aria-expanded={isMobileMenuOpen}
		>
			{#if isMobileMenuOpen}
				<X size={20} />
			{:else}
				<Menu size={20} />
			{/if}
		</button>
		<a href="/" class="text-lg font-bold tracking-tight text-primary sm:text-xl md:text-2xl">
			{STRINGS.NAVIGATION.BRAND}
		</a>
		<nav class="hidden gap-4 md:flex">
			<a
				href="/client/about"
				class={`text-xs font-medium transition-colors sm:text-sm ${
					isHome
						? 'text-text-inverse/80 hover:text-text-inverse'
						: 'text-text-muted hover:text-primary'
				}`}>{STRINGS.NAVIGATION.ABOUT}</a
			>
			<a
				href="/client/shop"
				class={`text-xs font-medium transition-colors sm:text-sm ${
					isHome
						? 'text-text-inverse/80 hover:text-text-inverse'
						: 'text-text-muted hover:text-primary'
				}`}>{STRINGS.NAVIGATION.SHOP}</a
			>
		</nav>
	</div>

	<div class="flex items-center gap-2.5 sm:gap-4">
		{#if isAuthenticated && user?.role !== 'admin'}
			<a
				href="/client/cart"
				class={`relative flex min-h-11 min-w-11 items-center justify-center rounded-lg transition-colors ${
					isHome && !isMobileMenuOpen
						? 'text-text-inverse hover:text-primary'
						: 'text-text-main hover:text-primary'
				}`}
				aria-label={STRINGS.NAVIGATION.CART}
			>
				<ShoppingCart size={20} />
				{#if cartCount > 0}
					<span class="cart-badge">
						{cartCount}
					</span>
				{/if}
			</a>
		{/if}

		{#if isAuthenticated}
			<HeaderDesktopUserMenu {isHome} {user} {handleLogout} />
		{:else}
			<div class="hidden gap-2 md:flex md:gap-4">
				<a
					href="/client/auth"
					class={`flex items-center gap-1 text-sm font-semibold transition-transform hover:scale-105 ${
						isHome
							? 'text-text-inverse/80 hover:text-text-inverse'
							: 'text-text-muted hover:text-primary'
					}`}
					aria-label={STRINGS.NAVIGATION.ACCOUNT}
					title={STRINGS.NAVIGATION.LOGIN}
				>
					<LogIn size={24} strokeWidth={1.5} />
				</a>
			</div>
		{/if}
	</div>

	<HeaderMobileMenu
		{isMobileMenuOpen}
		{isAuthenticated}
		{user}
		{handleLogout}
		on:close={() => (isMobileMenuOpen = false)}
	/>
</header>
