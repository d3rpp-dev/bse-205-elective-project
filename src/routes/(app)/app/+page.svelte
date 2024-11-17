<script lang="ts">
	import Main from "@/main.svelte";

	import { trpc } from "$lib/trpc/client";
	import { page } from "$app/stores";
	import { derived, writable, type Writable } from "svelte/store";
	import { onMount } from "svelte";
	import { list_private_keys } from "$lib/client/key_management";

	import AnimatedLoading from "$lib/icons/AnimatedLoading.svelte";
	import { X } from "lucide-svelte";

	import { FileCard } from "@/ui/file-card";

	const rpc = trpc($page);

	let userBlobsParams: Writable<{ kids: string[] }> = writable({
		kids: [],
	});
	const userBlobsQuery = rpc.user.fetchUploadedFileMetadata.createQuery(
		userBlobsParams,
		derived(userBlobsParams, ($userBlobsParams) => {
			return {
				enabled: $userBlobsParams.kids.length > 0,
			};
		}),
	);

	onMount(() => {
		$userBlobsParams.kids = list_private_keys();
	});
</script>

<!--Home Page Test-->

<Main class="min-h-app-main max-w-screen-lg">
	{#if $userBlobsQuery.isLoading}
		<div class="mt-24 grid h-24 w-full place-items-center">
			<AnimatedLoading class="size-12" />
		</div>
	{:else if $userBlobsQuery.isError}
		<div class="mt-24 grid h-24 w-full place-items-center">
			<X class="size-12 text-destructive-foreground" />
			Failed to Load
		</div>
	{:else}
		<div class="flex flex-row flex-wrap gap-4">
			{#each $userBlobsQuery.data! as file (file.id)}
				<FileCard {file} {rpc} />
			{/each}
		</div>
	{/if}
</Main>
