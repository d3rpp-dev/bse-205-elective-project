<script lang="ts">
	import { LandingHeader } from "@/headers";
	import { LandingFooter } from "@/footers";
	import Main from "@/main.svelte";

	const { data, children } = $props();
	const { user } = data;
</script>

<LandingHeader {user} />

<!-- div to add background to pages solely affected by the landing layout -->

<div class="bg-cover bg-center h-full" style="background-image: url('/backgroundsAndAssets/landerDecoBackgroundV2.svg'), linear-gradient(to right, #0A0A0A 30%, #6CFF96 100%); background-position: right center; background-repeat: no-repeat; background-size: 40%;">
	<Main class="h-landing-main">
		{@render children()}
	</Main>
</div>
<LandingFooter />
