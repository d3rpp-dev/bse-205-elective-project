<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	import type { LabelProps } from ".";

	const {
		class: className,
		inset = false,
		children,
		...rest
	}: LabelProps = $props();
</script>

<DropdownMenuPrimitive.Label
	class={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
	{...rest}
>
	{#if children}
		{@render children()}
	{/if}
</DropdownMenuPrimitive.Label>
