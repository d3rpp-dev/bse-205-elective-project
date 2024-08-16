<script lang="ts">
	import { Button as ButtonPrimitive } from "bits-ui";
	import { type Props, buttonVariants } from "./index.js";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		variant,
		size,
		builders,

		// HTML attributes
		type = "button",

		// Events
		onclick,
		onkeydown,

		// Children
		children,
		...rest
	}: Props = $props();
</script>

<!--
	@component

    Button :D
-->

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }))}
	{type}
	{onclick}
	{onkeydown}
	{...rest}
>
	{#if children}
		{@render children()}
	{/if}
</ButtonPrimitive.Root>
