<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";
	import { cn } from "$lib/utils";

	let {
		class: className,

		// Events
		onblur,
		onchange,
		onclick,
		onfocus,
		onkeydown,
		onkeyup,
		onmouseover,
		onmouseenter,
		onmouseleave,
		onmousemove,
		onpaste,
		oninput,
		onwheel,

		value = $bindable(),
		...rest
	}: HTMLInputAttributes = $props();
</script>

<input
	class={cn(
		"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className,
	)}
	bind:value
	{onblur}
	{onchange}
	{onclick}
	{onfocus}
	{onkeydown}
	{onkeyup}
	{onmouseover}
	{onmouseenter}
	{onmouseleave}
	{onmousemove}
	{onpaste}
	{oninput}
	{onwheel}
	{...rest}
/>
