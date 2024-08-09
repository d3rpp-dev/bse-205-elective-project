<script lang="ts">
	import "../app.css";

	import { ModeWatcher } from "mode-watcher";
	import ThemeToggle from "$lib/components/theme-toggle.svelte";

	import Icons from "$lib/icons";
</script>

<ModeWatcher />

<header
	class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container mx-auto flex h-14 max-w-screen-2xl items-center px-4">
		<div class="flex md:mr-4">
			<Icons.lock />
			<span class="ml-2 font-bold sm:inline-block">Secure Store</span>
		</div>

		<div
			class="hidden flex-1 items-center justify-between space-x-2 md:flex md:justify-end"
		>
			<ThemeToggle />
		</div>
	</div>
</header>

<main class="mx-auto my-4 max-w-screen-2xl">
	<slot />
</main>

<style lang="postcss">
</style>
