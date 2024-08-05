<script>
	import "../app.css";

	import { ModeWatcher } from "mode-watcher";
    import ThemeToggle from "$lib/components/theme-toggle.svelte";

	import Icons from "$lib/icons";
</script>

<ModeWatcher  />

<header
	class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container mx-auto flex h-14 max-w-screen-2xl items-center">
		<div class="mr-4 hidden md:flex">
			<Icons.lock />
			<span class="ml-2 hidden font-bold sm:inline-block">Secure Store</span>
		</div>

		<div
			class="flex flex-1 items-center justify-between space-x-2 md:justify-end"
		>
			<ThemeToggle />
		</div>
	</div>
</header>

<main class="max-w-screen-2xl mx-auto my-4">
    <slot />
</main>

<style lang="postcss">
</style>
