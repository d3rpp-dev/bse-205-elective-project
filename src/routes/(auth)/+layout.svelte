<script lang="ts">
	import { AppHeader } from "@/headers";
	import { AppFooter } from "@/footers";

	const { children } = $props();
</script>

<div class="h-screen">
	<AppHeader />

	{@render children()}

	<AppFooter />
</div>
