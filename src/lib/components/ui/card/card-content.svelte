<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils";

	const {
		class: className,

		children,
		...rest
	}: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={cn("p-6 pt-0", className)} {...rest}>
	{#if children}
		{@render children()}
	{/if}
</div>
