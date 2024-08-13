<script lang="ts">
	import { cn } from "$lib/utils.js";

	import type { ShortcutProps } from ".";

	const { class: className, children, ...rest }: ShortcutProps = $props();
</script>

<span
	class={cn("ml-auto text-xs tracking-widest opacity-60", className)}
	{...rest}
>
	{@render children()}
</span>
