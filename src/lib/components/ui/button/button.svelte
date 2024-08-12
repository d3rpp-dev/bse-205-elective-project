<script lang="ts">
	import { Button as ButtonPrimitive } from "bits-ui";
	import { type Props, buttonVariants } from "./index.js";
	import { cn } from "$lib/utils.js";

	let {
		class: className = undefined,
		variant,
		size,
		builders,
		children,
	}: Props = $props();
</script>

<!--
	@component

	> **NOTE**
	> 
	> For some unknown dumbass reason, typescript screams in 
	> pain when i use `...rest` in the `props`. So for now, we'll limit 
	> our stuff to this.
-->

<ButtonPrimitive.Root
	{builders}
	class={cn(buttonVariants({ variant, size, className }))}
	type="button"
	on:click
	on:keydown
>
	{@render children()}
</ButtonPrimitive.Root>
