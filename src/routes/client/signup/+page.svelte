<script lang="ts">
	import SignupForm from '$lib/components/SignupForm.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<SignupForm data={data.form} />
