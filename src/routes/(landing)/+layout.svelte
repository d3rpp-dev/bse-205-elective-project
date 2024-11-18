<script lang="ts">
	import { LandingHeader } from "@/headers";
	import { LandingFooter } from "@/footers";
	import Main from "@/main.svelte";

	const { data, children } = $props();
	const { user } = data;
</script>

<LandingHeader {user} />

<div
	class="h-full bg-cover bg-center"
	style="background-image: url('/src/lib/backgroundsAndAssets/landerDecoBackgroundV2.svg'), linear-gradient(to right, #000000 30%, #6CFF96 100%); background-position: right center; background-repeat: no-repeat; background-size: 40%;"
>
	<Main class="h-landing-main">
		{@render children()}
	</Main>
</div>
<LandingFooter />
