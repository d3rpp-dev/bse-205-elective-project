<script lang="ts">
	import { LandingHeader } from "@/headers";
	import { LandingFooter } from "@/footers";

	const { data, children } = $props();
	const { user } = data;
</script>

<LandingHeader {user} />

<!-- div to add background to pages solely affected by the landing layout -->

<div
	class="h-auto min-h-landing-main bg-cover bg-center"
	style="background-image: url('/backgroundsAndAssets/newLandingBackground.jpg');background-attachment: fixed; background-size: cover; background-position: center;"
>
	{@render children()}
</div>
<LandingFooter />
