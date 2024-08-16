<script lang="ts">
	import { Label as LabelPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	const {
		class: className,

		onmousedown,

		children,
		...rest
	}: LabelPrimitive.Props = $props();
</script>

<LabelPrimitive.Root
	class={cn(
		"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
		className,
	)}
	{...rest}
	{onmousedown}
>
	{#if children}{@render children()}{/if}
</LabelPrimitive.Root>
