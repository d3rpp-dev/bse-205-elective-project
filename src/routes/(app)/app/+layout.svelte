<script lang="ts">
	import { AppHeader } from "@/headers";

	const { data, children } = $props();
	const { user } = data;
</script>

<AppHeader {user} />

<main class="mx-auto my-4 max-w-screen-2xl">
	{@render children()}
</main>
