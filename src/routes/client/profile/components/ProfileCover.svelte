<script lang="ts">
	import { User, Camera } from 'lucide-svelte';
	export let avatarPreview: string | null;
	export let defaultAvatar: string | null;

	function handleAvatarChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			avatarPreview = URL.createObjectURL(file);
		}
	}
</script>

<div class="relative h-28 bg-gradient-to-r from-primary to-primary-hover sm:h-36">
	<div class="absolute -bottom-10 left-6 sm:-bottom-12 sm:left-8">
		<div class="relative h-20 w-20 sm:h-24 sm:w-24">
			<div class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-surface bg-surface-alt shadow-lg">
				{#if avatarPreview || defaultAvatar}
					<img src={avatarPreview || defaultAvatar} alt="Avatar" class="h-full w-full object-cover" />
				{:else}
					<User size={36} class="text-text-muted sm:h-10 sm:w-10" />
				{/if}
			</div>
			<label for="avatar_upload" class="absolute bottom-0 right-0 cursor-pointer rounded-full bg-primary p-1.5 text-secondary shadow-md transition-transform hover:scale-110 hover:bg-primary-hover" aria-label="Change avatar">
				<Camera size={14} class="sm:h-4 sm:w-4" />
				<input type="file" id="avatar_upload" name="avatar" form="profile_form" accept="image/*" class="hidden" on:change={handleAvatarChange} />
			</label>
		</div>
	</div>
</div>
