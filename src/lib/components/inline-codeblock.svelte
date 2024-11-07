<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements"

	import { cn } from "$lib/utils";
    
    const {
        children,
        class: className,

        ...rest
    }: HTMLAttributes<HTMLSpanElement> = $props();
</script>

<code class={cn(
    "rounded-sm bg-slate-500/30 p-1 font-mono",
    className
    )} 
    {...rest}
>
    {@render children?.()}
</code>