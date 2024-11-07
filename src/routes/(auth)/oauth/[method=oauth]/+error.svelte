<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import Main from "@/main.svelte";

	let error = $page.error;
</script>

<Main class="flex h-app-main flex-col items-center justify-center gap-4">
	{#if error}
		<h1 class="text-6xl">Uh Oh</h1>
		<h2 class="text-xl">This is a problem</h2>
		<code class="font-mono">{error.message}</code>
		<a href="/" class="underline underline-offset-2">Go Home</a>
	{/if}
</Main>
