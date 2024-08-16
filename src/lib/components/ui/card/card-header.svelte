<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	const {
		class: className,

		children,
		...rest
	}: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={cn("flex flex-col space-y-1.5 p-6", className)} {...rest}>
	{#if children}
		{@render children()}
	{/if}
</div>
