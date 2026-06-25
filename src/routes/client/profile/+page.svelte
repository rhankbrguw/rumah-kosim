<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { STRINGS } from '$lib/constants/strings';
	import { Save } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import ProfileCover from './components/ProfileCover.svelte';
	import PersonalInfo from './components/PersonalInfo.svelte';
	import SecurityInfo from './components/SecurityInfo.svelte';
	
	export let data;
	
	let avatarPreview: string | null = null;

	const { form, errors, constraints, enhance, message, delayed } = superForm(data.form, {
		onResult: async ({ result }) => {
			if (result.type === 'success') {
				toast.success(STRINGS.PROFILE.MESSAGES.UPDATE_SUCCESS);
				avatarPreview = null;
				await invalidateAll();
			}
		}
	});
</script>

<div class="mx-auto w-full max-w-4xl px-4 pt-24 pb-12 sm:px-6 sm:pt-28 sm:pb-16 lg:px-8">
	<div class="overflow-hidden rounded-2xl border border-surface-alt/50 bg-surface/90 shadow-lg backdrop-blur-xl">
		<ProfileCover bind:avatarPreview defaultAvatar={data.avatar} />

		<div class="p-6 pt-14 sm:p-8 sm:pt-16 lg:p-10 lg:pt-20">
			<h1 class="mb-2 text-2xl font-bold text-text-main sm:text-3xl">{STRINGS.PROFILE.TITLE}</h1>
			<p class="mb-8 text-sm text-text-muted">Manage your personal information and security settings.</p>
			
			{#if $message}
				<div class="mb-6 rounded-lg bg-surface-alt p-4 text-sm text-text-main">
					{$message}
				</div>
			{/if}

			<form id="profile_form" method="POST" enctype="multipart/form-data" use:enhance>
				<PersonalInfo form={$form} errors={$errors} constraints={$constraints} />
				<SecurityInfo form={$form} errors={$errors} constraints={$constraints} />

				<div class="mt-8 flex items-center justify-end border-t border-surface-alt pt-6">
					<button
						type="submit"
						disabled={$delayed}
						class="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-secondary shadow-md transition-all hover:bg-primary-hover hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
					>
						{#if $delayed}
							<div class="h-5 w-5 animate-spin rounded-full border-2 border-secondary border-t-transparent"></div>
							Saving...
						{:else}
							<Save size={18} />
							{STRINGS.PROFILE.BUTTON_UPDATE}
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
