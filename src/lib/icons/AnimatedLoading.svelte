<script lang="ts">
	import { cn } from "$lib/utils";
	import type { ClassValue } from "clsx";
	import { LoaderCircle } from "lucide-svelte";

	interface Props {
		class?: ClassValue;
	}

	const { class: className = undefined }: Props = $props();
</script>

<LoaderCircle class={cn("h-4 w-4 animate-spin", className)} />
