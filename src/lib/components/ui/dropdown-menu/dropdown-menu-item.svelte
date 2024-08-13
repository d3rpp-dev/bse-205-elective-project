<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	import type { ItemProps } from ".";

	const {
		class: className,
		inset = false,

		// Events
		onclick,
		onkeydown,
		onfocusin,
		onfocusout,
		onpointerdown,
		onpointerleave,
		onpointermove,

		// Children
		children,
		...rest
	}: ItemProps = $props();
</script>

<DropdownMenuPrimitive.Item
	class={cn(
		"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
		inset && "pl-8",
		className,
	)}
	{...rest}
	{onclick}
	{onkeydown}
	{onfocusin}
	{onfocusout}
	{onpointerdown}
	{onpointerleave}
	{onpointermove}
>
	{@render children()}
</DropdownMenuPrimitive.Item>
