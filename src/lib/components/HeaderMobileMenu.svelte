<script lang="ts">
	import { LogIn } from 'lucide-svelte';

	import { resolveRoute } from '$app/paths';
	export let isMobileMenuOpen: boolean;
	export let isAuthenticated: boolean;

	export let user: Record<string, unknown> | null;
	export let handleLogout: () => void;
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div
	class={`w-full border-t border-surface-alt md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
>
	<nav class="flex flex-col py-2">
		<a href="/client/about" class="px-4 py-2 text-sm text-text-muted hover:text-primary">About</a>
		<a href="/client/shop" class="px-4 py-2 text-sm text-text-muted hover:text-primary">Shop</a>
		{#if !isAuthenticated}
			<a
				href="/client/auth"
				class="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-primary"
				><LogIn size={20} /> Auth</a
			>
		{:else}
			<a href="/client/profile" class="px-4 py-2 text-sm text-text-muted hover:text-primary">
				👤 Profile
			</a>
			<a
				href={user?.role === 'admin'
					? resolveRoute('/admin')
					: resolveRoute('/client/profile/history')}
				class="px-4 py-2 text-sm text-text-muted hover:text-primary"
			>
				{user?.role === 'admin' ? '⚙️ Settings' : '📜 History'}
			</a>
			<button
				on:click={handleLogout}
				class="w-full cursor-pointer px-4 py-2 text-left text-sm text-danger hover:text-danger-hover"
			>
				Logout
			</button>
		{/if}
	</nav>
</div>
