<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils";

	const {
		class: className,

		children,
		...rest
	}: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	class={cn(
		"rounded-lg border bg-card text-card-foreground shadow-sm",
		className,
	)}
	{...rest}
>
	{#if children}
		{@render children()}
	{/if}
</div>
