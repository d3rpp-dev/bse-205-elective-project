<script lang="ts">
	import "../app.css";

	import type { Snippet } from "svelte";

	import { ModeWatcher, mode } from "mode-watcher";
	import { QueryClientProvider } from "@tanstack/svelte-query";
	import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";

	import type { LayoutData } from "./$types";

	import { Toaster } from "@/ui/sonner";

	const { queryClient, children }: LayoutData & { children: Snippet } =
		$props();
</script>

<svelte:head>
	<title>Jail Bird</title>
</svelte:head>

<ModeWatcher defaultMode="system" />

<Toaster position="bottom-center" theme={$mode ?? "system"} richColors />

<QueryClientProvider client={queryClient}>
	{@render children()}
	<SvelteQueryDevtools />
</QueryClientProvider>
