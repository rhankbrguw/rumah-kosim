<script lang="ts">
	import LoginForm from '$lib/components/LoginForm.svelte';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<LoginForm data={data.form} />
