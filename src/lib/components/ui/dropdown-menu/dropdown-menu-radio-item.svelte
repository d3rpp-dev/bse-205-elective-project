<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import Circle from "lucide-svelte/icons/circle";
	import { cn } from "$lib/utils";

	import type { RadioItemProps } from ".";

	let {
		class: className,
		value = $bindable(),

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
	}: RadioItemProps = $props();
</script>

<DropdownMenuPrimitive.RadioItem
	class={cn(
		"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
		className,
	)}
	{value}
	{...rest}
	{onclick}
	{onkeydown}
	{onfocusin}
	{onfocusout}
	{onpointerdown}
	{onpointerleave}
	{onpointermove}
>
	<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
		<DropdownMenuPrimitive.RadioIndicator>
			<Circle class="h-2 w-2 fill-current" />
		</DropdownMenuPrimitive.RadioIndicator>
	</span>
	{#if children}
		{@render children()}
	{/if}
</DropdownMenuPrimitive.RadioItem>
