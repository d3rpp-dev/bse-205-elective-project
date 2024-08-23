<script lang="ts">
	import { LandingHeader } from "@/headers";
	import { LandingFooter } from "@/footers";
	import Main from "@/main.svelte";

	const { data, children } = $props();
	const { user } = data;
</script>

<LandingHeader {user} />

<Main class="h-landing-main">
	{@render children()}
</Main>

<LandingFooter />
