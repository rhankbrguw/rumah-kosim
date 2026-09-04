<script lang="ts">
	import { LogIn, User, History, LayoutDashboard, LogOut, Info, ShoppingBag } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { resolveRoute } from '$app/paths';

	export let isMobileMenuOpen: boolean;
	export let isAuthenticated: boolean;
	export let user: Record<string, unknown> | null;
	export let handleLogout: () => void;

	const dispatch = createEventDispatcher();

	function handleLinkClick() {
		dispatch('close');
	}
</script>

{#if isMobileMenuOpen}
	<!-- eslint-disable svelte/no-navigation-without-resolve -->
	<div class="w-full border-t border-surface-alt bg-surface/95 backdrop-blur-md md:hidden">
		<nav class="flex flex-col space-y-1 p-2">
			<a
				href="/client/about"
				class="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-primary"
				on:click={handleLinkClick}
			>
				<Info size={16} /> About
			</a>
			<a
				href="/client/shop"
				class="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-primary"
				on:click={handleLinkClick}
			>
				<ShoppingBag size={16} /> Shop
			</a>
			{#if !isAuthenticated}
				<a
					href="/client/auth"
					class="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-surface-alt"
					on:click={handleLinkClick}
				>
					<LogIn size={16} /> Sign In / Register
				</a>
			{:else}
				<a
					href="/client/profile"
					class="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-primary"
					on:click={handleLinkClick}
				>
					<User size={16} /> Profile
				</a>
				<a
					href={user?.role === 'admin'
						? resolveRoute('/admin')
						: resolveRoute('/client/profile/history')}
					class="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-primary"
					on:click={handleLinkClick}
				>
					{#if user?.role === 'admin'}
						<LayoutDashboard size={16} /> Admin Dashboard
					{:else}
						<History size={16} /> Order History
					{/if}
				</a>
				<button
					on:click={() => {
						handleLinkClick();
						handleLogout();
					}}
					class="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-danger transition-colors hover:bg-danger-light hover:text-danger-hover"
				>
					<LogOut size={16} /> Logout
				</button>
			{/if}
		</nav>
	</div>
{/if}
