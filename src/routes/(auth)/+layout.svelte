<script lang="ts">
	import { AppHeader } from "@/headers";
	import { AppFooter } from "@/footers";

	const { children } = $props();
</script>

<div class="h-screen">
	<AppHeader user={null} />

	{@render children()}

	<AppFooter />
</div>
