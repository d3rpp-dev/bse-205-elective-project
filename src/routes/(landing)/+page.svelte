<script lang="ts">
	import { page } from "$app/stores";
	import { trpc } from "$lib/trpc/client";
	import { debounce } from "$lib/utils";

	import Main from "@/main.svelte";
	import { Input } from "@/ui/input";
	import { writable } from "svelte/store";

	const rpc = trpc($page);
	const utils = rpc.createUtils();

	const query_params = writable({ num: 0 });

	const query = rpc.greeter.oddOrEven.createQuery(query_params);
</script>

<Main>
	<div class="flex flex-col items-start justify-start">
		<h1 class="text-hero">Jail Bird</h1>

		<Input
			type="number"
			value={0}
			onchange={debounce((ev) => {
				ev.preventDefault();
				if (!(ev.target instanceof HTMLInputElement)) return;
				query_params.set({ num: +ev.target.value });
				utils.greeter.oddOrEven.invalidate();
			}, 500)}
		/>

		{#if $query.isLoading}
			<pre>Checking...</pre>
		{:else if $query.isError}
			<pre>{JSON.stringify($query.error, null, 2)}</pre>
		{:else}
			<pre>{JSON.stringify($query.data, null, 2)}</pre>
		{/if}
	</div>
</Main>
