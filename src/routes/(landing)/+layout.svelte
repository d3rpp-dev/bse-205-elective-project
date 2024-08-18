<script lang="ts">
	import { LandingHeader } from "@/headers";
	import { LandingFooter } from "@/footers";
	import Main from "@/main.svelte";

	const { children } = $props();
</script>

<LandingHeader />

<Main class="h-landing-main">
	{@render children()}
</Main>

<LandingFooter />
