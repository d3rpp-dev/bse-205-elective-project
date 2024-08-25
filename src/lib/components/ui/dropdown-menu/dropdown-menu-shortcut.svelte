<script lang="ts">
	import { cn } from "$lib/utils";

	import type { ShortcutProps } from ".";

	const { class: className, children, ...rest }: ShortcutProps = $props();
</script>

<span
	class={cn("ml-auto text-xs tracking-widest opacity-60", className)}
	{...rest}
>
	{#if children}
		{@render children()}
	{/if}
</span>
