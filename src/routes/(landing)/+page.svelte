<script lang="ts">
	import { page } from "$app/stores";
	import { trpc } from "$lib/trpc/client";

	import Main from "@/main.svelte";
	import Suspense from "@/suspense.svelte";

	const query = trpc($page).greeter.greeting.createQuery({
		name: "12345678901",
	});
	type QueryError = (typeof $query)["error"];
</script>

<Main>
	<div class="flex flex-col items-start justify-start">
		<h1 class="text-hero">Jail Bird</h1>

		{#snippet onpending()}
			<span>Loading...</span>
		{/snippet}

		{#snippet onerror(error: QueryError)}
			<span>Error</span>
			<pre><code>{error?.message}</code></pre>
		{/snippet}

		{#snippet ondone(data: string | undefined, is_placeholder: boolean)}
			<pre>is_placeholder: {is_placeholder}</pre>
			<span>{data}</span>
		{/snippet}

		<Suspense {query} {ondone} {onerror} {onpending} />
	</div>
</Main>
