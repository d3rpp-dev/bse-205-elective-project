<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn, flyAndScale } from "$lib/utils";

	import type { ContentProps } from ".";

	const {
		class: className,
		sideOffset = 4,
		transition = flyAndScale,
		transitionConfig,

		// Events
		onkeydown,

		// Children
		children,
		...rest
	}: ContentProps = $props();
</script>

<DropdownMenuPrimitive.Content
	{transition}
	{transitionConfig}
	{sideOffset}
	class={cn(
		"z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none",
		className,
	)}
	{...rest}
	{onkeydown}
>
	{#if children}
		{@render children()}
	{/if}
</DropdownMenuPrimitive.Content>
