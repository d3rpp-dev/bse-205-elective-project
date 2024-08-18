<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		/**
		 * Ignored.
		 */
		// eslint-disable-next-line
		type = "file",

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

		...rest
	}: HTMLInputAttributes = $props();
</script>

<!-- 

    @component

    This bloody thing only exists because `$bindable` causes svelte to reset 
    the value to it's current value on every state change which triggers a 
    DOMException.

    Damn you Rich Harris.

-->

<input
	class={cn(
		"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className,
	)}
	type="file"
	ondragenter={(ev) => {
		ev.stopPropagation();
		ev.preventDefault();
	}}
	ondragexit={(ev) => {
		ev.stopPropagation();
		ev.preventDefault();
	}}
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
