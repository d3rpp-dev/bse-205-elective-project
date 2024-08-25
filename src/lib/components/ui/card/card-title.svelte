<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { HeadingLevel } from "./index.js";
	import { cn } from "$lib/utils";

	const {
		class: className = undefined,
		tag = "h3",

		children,
		...rest
	}: HTMLAttributes<HTMLHeadingElement> & {
		tag?: HeadingLevel;
	} = $props();
</script>

<svelte:element
	this={tag}
	class={cn("text-lg font-semibold leading-none tracking-tight", className)}
	{...rest}
>
	{#if children}
		{@render children()}
	{/if}
</svelte:element>
