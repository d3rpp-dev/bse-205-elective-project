<script lang="ts">
	import { APPLICATION_NAME, APPLICATION_ICON } from ".";

	import ThemeToggle from "@/theme-toggle.svelte";
</script>

<header
	class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container mx-auto flex h-24 max-w-screen-2xl items-center px-4">
		<div class="flex items-center md:mr-4">
			<!-- This is apparently svelte 5, this is cursed -->
			<APPLICATION_ICON size="2.5rem" />
			<span class="ml-4 h-6 text-lg font-bold sm:inline-block">
				{APPLICATION_NAME}
			</span>
		</div>

		<div
			class="hidden flex-1 items-center justify-between space-x-2 md:flex md:justify-end"
		>
			<ThemeToggle />
		</div>
	</div>
</header>
