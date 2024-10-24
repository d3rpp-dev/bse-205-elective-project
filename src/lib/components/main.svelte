<script lang="ts">
	import { cn } from "$lib/utils";
	import type { HTMLAttributes } from "svelte/elements";
	const {
		class: className,

		children,
	}: HTMLAttributes<HTMLDivElement> = $props();
</script>

<!-- 
	@component
	
	This is a reusable `<main>` tag, it has all of the classes to be nice and 
	usable and can be expanded later to also work on mobile.
-->

<main class={cn("mx-auto max-w-screen-2xl px-4 py-4 2xl:px-0", className)}>
	{@render children?.()}
</main>
