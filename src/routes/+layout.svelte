<script lang="ts">
	import "../app.css";

	import type { Snippet } from "svelte";

	import { ModeWatcher } from "mode-watcher";
	import { QueryClientProvider } from "@tanstack/svelte-query";
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools"

	import type { LayoutData } from "./$types";

	const { queryClient, children }: LayoutData & { children: Snippet } = $props();
</script>

<svelte:head>
	<title>Jail Bird</title>
</svelte:head>

<ModeWatcher defaultMode="system" />

<QueryClientProvider client={queryClient}>
	{@render children()}
	<SvelteQueryDevtools />
</QueryClientProvider>
