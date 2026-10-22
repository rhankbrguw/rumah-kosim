<script lang="ts">
	import { LogIn, User, History, LayoutDashboard, LogOut, Info, ShoppingBag } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { resolveRoute } from '$app/paths';
	import { CLIENT_ROUTES } from '$lib/constants/routes.js';
	import { STRINGS } from '$lib/constants/strings.js';

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
	<div class="w-full border-t border-surface-alt bg-surface/95 backdrop-blur-md md:hidden">
		<nav class="flex flex-col space-y-1 p-2">
			<a
				href={resolveRoute(CLIENT_ROUTES.ABOUT)}
				class="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-primary"
				on:click={handleLinkClick}
			>
				<Info size={16} />
				{STRINGS.NAVIGATION.ABOUT}
			</a>
			<a
				href={resolveRoute(CLIENT_ROUTES.SHOP)}
				class="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-primary"
				on:click={handleLinkClick}
			>
				<ShoppingBag size={16} />
				{STRINGS.NAVIGATION.SHOP}
			</a>
			{#if !isAuthenticated}
				<a
					href={resolveRoute(CLIENT_ROUTES.AUTH)}
					class="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-surface-alt"
					on:click={handleLinkClick}
				>
					<LogIn size={16} />
					{STRINGS.NAVIGATION.LOGIN}
				</a>
			{:else}
				<a
					href={resolveRoute(CLIENT_ROUTES.PROFILE)}
					class="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-primary"
					on:click={handleLinkClick}
				>
					<User size={16} />
					{STRINGS.PROFILE.TITLE}
				</a>
				<a
					href={user?.role === 'admin'
						? resolveRoute(CLIENT_ROUTES.ADMIN)
						: resolveRoute(CLIENT_ROUTES.HISTORY)}
					class="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-primary"
					on:click={handleLinkClick}
				>
					{#if user?.role === 'admin'}
						<LayoutDashboard size={16} /> {STRINGS.ADMIN.PAGE_TITLE}
					{:else}
						<History size={16} /> {STRINGS.ORDER_HISTORY.TITLE}
					{/if}
				</a>
				<button
					on:click={() => {
						handleLinkClick();
						handleLogout();
					}}
					class="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-danger transition-colors hover:bg-danger-light hover:text-danger-hover"
				>
					<LogOut size={16} />
					{STRINGS.ADMIN.LOGOUT}
				</button>
			{/if}
		</nav>
	</div>
{/if}
