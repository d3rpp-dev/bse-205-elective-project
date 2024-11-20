<script lang="ts">
	import { LandingHeader } from "@/headers";
	import { LandingFooter } from "@/footers";

	const { data, children } = $props();
	const { user } = data;
</script>

<LandingHeader {user} />

<!-- div to add background to pages solely affected by the landing layout -->

<div
	class="min-h-landing-main h-auto bg-cover bg-center"
	style="background-image: url('/backgroundsAndAssets/newLandingBackground.jpg');background-attachment: fixed; background-size: cover; background-position: center;"
>
    {@render children()}
</div>
<LandingFooter />
