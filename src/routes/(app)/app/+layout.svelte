<script lang="ts">
	import { AppFooter } from "@/footers";
	import { AppHeader } from "@/headers";
	import Main from "@/main.svelte";

	const { data, children } = $props();
	const { user } = data;
</script>

<AppHeader {user} />
<div
	class="h-full bg-cover bg-center"
	style="background-image: url('/backgroundsAndAssets/newBackground2.jpg');background-attachment: fixed; background-size: cover; background-position: center;"
>
	<Main>
		{@render children()}
	</Main>
</div>
<AppFooter />
