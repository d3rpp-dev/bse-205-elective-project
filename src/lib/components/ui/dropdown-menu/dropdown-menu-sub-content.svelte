<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn, flyAndScale } from "$lib/utils";

	import type { SubContentProps } from ".";

	const {
		class: className,
		transition = flyAndScale,
		transitionConfig = { x: -10, y: 0 },

		// Events
		onkeydown,
		onfocusout,
		onpointermove,

		// Children
		children,
		...rest
	}: SubContentProps = $props();
</script>

<DropdownMenuPrimitive.SubContent
	{transition}
	{transitionConfig}
	class={cn(
		"z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-lg focus:outline-none",
		className,
	)}
	{...rest}
	{onkeydown}
	{onfocusout}
	{onpointermove}
>
	{#if children}
		{@render children()}
	{/if}
</DropdownMenuPrimitive.SubContent>
