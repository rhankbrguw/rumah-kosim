<script lang="ts">
	import AuthForm from '$lib/components/AuthForm.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<AuthForm data={data} />
