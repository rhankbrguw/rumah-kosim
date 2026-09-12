<script lang="ts">
	import { UserCircle, User, History, LayoutDashboard, LogOut } from 'lucide-svelte';
	import { CLIENT_ROUTES } from '$lib/constants/routes.js';
	import { STRINGS } from '$lib/constants/strings.js';

	export let isHome: boolean;
	export let user: { avatar?: string; role?: string } | null;
	export let handleLogout: () => void;
</script>

<div class="group relative hidden md:block">
	<div class="flex cursor-pointer items-center transition-transform hover:scale-105">
		<div
			class={isHome
				? 'text-text-inverse/80 hover:text-text-inverse'
				: 'text-text-muted hover:text-primary'}
		>
			{#if user?.avatar}
				<img
					src={user.avatar}
					alt={STRINGS.PROFILE.AVATAR.ALT}
					class="h-8 w-8 rounded-full border border-surface-alt object-cover shadow-sm"
				/>
			{:else}
				<UserCircle size={28} strokeWidth={1.5} />
			{/if}
		</div>
	</div>
	<div
		class="absolute right-0 hidden w-48 rounded-xl border border-surface-alt bg-surface p-1 shadow-lg group-hover:block"
	>
		<a
			href={CLIENT_ROUTES.PROFILE}
			class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-primary"
		>
			<User size={15} />
			{STRINGS.PROFILE.TITLE}
		</a>
		<a
			href={user?.role === 'admin' ? CLIENT_ROUTES.ADMIN : CLIENT_ROUTES.HISTORY}
			class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-primary"
		>
			{#if user?.role === 'admin'}
				<LayoutDashboard size={15} /> {STRINGS.ADMIN.PAGE_TITLE}
			{:else}
				<History size={15} /> {STRINGS.ORDER_HISTORY.TITLE}
			{/if}
		</a>
		<button
			on:click={handleLogout}
			class="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-danger transition-colors hover:bg-danger-light hover:text-danger-hover"
		>
			<LogOut size={15} />
			{STRINGS.ADMIN.LOGOUT}
		</button>
	</div>
</div>
