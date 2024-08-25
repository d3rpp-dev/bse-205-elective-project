<script lang="ts">
	import "../app.css";

	import type { Snippet } from "svelte";

	import { ModeWatcher } from "mode-watcher";
	import { QueryClientProvider } from "@tanstack/svelte-query";
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";

	import type { LayoutData } from "./$types";
	import { setRuntimeClientContext } from "$lib/client";

	import { Toaster } from "@/ui/sonner";

	const {
		queryClient,
		runtimeClient,
		children,
	}: LayoutData & { children: Snippet } = $props();

	setRuntimeClientContext(runtimeClient);
</script>

<svelte:head>
	<title>Jail Bird</title>
</svelte:head>

<ModeWatcher defaultMode="system" />

<Toaster position="bottom-center" />

<QueryClientProvider client={queryClient}>
	{@render children()}
	<SvelteQueryDevtools />
</QueryClientProvider>
