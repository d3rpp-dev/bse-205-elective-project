<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import Check from "lucide-svelte/icons/check";
	import { cn } from "$lib/utils";

	import type { CheckBoxItemProps } from ".";

	let {
		class: className,
		checked = $bindable(undefined),

		// Events
		onclick,
		onkeydown,
		onfocusin,
		onfocusout,
		onpointerdown,
		onpointerleave,
		onpointermove,

		// Chidren
		children,
		...rest
	}: CheckBoxItemProps = $props();
</script>

<DropdownMenuPrimitive.CheckboxItem
	bind:checked
	class={cn(
		"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
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
	<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
		<DropdownMenuPrimitive.CheckboxIndicator>
			<Check class="h-4 w-4" />
		</DropdownMenuPrimitive.CheckboxIndicator>
	</span>
	{#if children}
		{@render children()}
	{/if}
</DropdownMenuPrimitive.CheckboxItem>
