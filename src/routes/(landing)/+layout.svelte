<script lang="ts">
	import LandingHeader from "@/headers/landing-header.svelte";

	import type { Snippet } from "svelte";

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
</script>

<LandingHeader />

{@render children()}
