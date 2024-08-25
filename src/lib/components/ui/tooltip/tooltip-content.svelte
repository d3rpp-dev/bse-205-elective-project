<script lang="ts">
	import { Tooltip as TooltipPrimitive } from "bits-ui";
	import { cn, flyAndScale } from "$lib/utils";

	const {
		class: className,
		sideOffset = 4,
		transition = flyAndScale,
		transitionConfig = { y: 8, duration: 150 },

		children,
		...rest
	}: TooltipPrimitive.ContentProps = $props();
</script>

<TooltipPrimitive.Content
	{transition}
	{transitionConfig}
	{sideOffset}
	class={cn(
		"z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
		className,
	)}
	{...rest}
>
	{#if children}
		{@render children()}
	{/if}
</TooltipPrimitive.Content>
