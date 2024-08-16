<script lang="ts">
	import { page } from "$app/stores";
	import { trpc } from "$lib/trpc/client";
	import { debounce } from "$lib/utils";
	import { writable } from "svelte/store";

	const rpc = trpc($page);
	const utils = rpc.createUtils();

	const username = writable({ username: "" });

	const query = rpc.auth.check_username_availability.createQuery(username);
</script>

<input
	type="text"
	oninput={debounce((ev) => {
		ev.preventDefault();
		if (!(ev.target instanceof HTMLInputElement)) return;
		username.set({ username: ev.target.value });
		utils.auth.check_username_availability.invalidate();
	}, 500)}
/>

{#if $query.isFetching}
	loading
{:else}
	<span>{$query.data?.available}</span>
{/if}
