<script lang="ts">
	import { AppFooter } from "@/footers";
	import { AppHeader } from "@/headers";

	const { data, children } = $props();
	const { user } = data;
</script>

<AppHeader {user} />

{@render children()}

<AppFooter />
