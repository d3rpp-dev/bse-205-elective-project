<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import ChevronRight from "lucide-svelte/icons/chevron-right";
	import { cn } from "$lib/utils";

	import type { SubTriggerProps } from ".";

	const {
		class: className,
		inset = false,

		// Events
		onclick,
		onkeydown,
		onfocusin,
		onfocusout,
		onpointerleave,
		onpointermove,

		// Children
		children,
		...rest
	}: SubTriggerProps = $props();
</script>

<DropdownMenuPrimitive.SubTrigger
	class={cn(
		"flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[state=open]:bg-accent data-[highlighted]:text-accent-foreground data-[state=open]:text-accent-foreground",
		inset && "pl-8",
		className,
	)}
	{...rest}
	{onclick}
	{onkeydown}
	{onfocusin}
	{onfocusout}
	{onpointerleave}
	{onpointermove}
>
	{#if children}
		{@render children()}
	{/if}
	<ChevronRight class="ml-auto h-4 w-4" />
</DropdownMenuPrimitive.SubTrigger>
