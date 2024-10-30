<script lang="ts">
	import { cn } from "$lib/utils";
	import type { trpc } from "$lib/trpc/client";

	import AnimatedLoading from "$lib/icons/AnimatedLoading.svelte";
	import ErrorX from "lucide-svelte/icons/x";

	import CreateKeyDialog from "./create_key_dialog.svelte";

	import * as Card from "@/ui/card";

	const {
		rpc,
	}: {
		rpc: ReturnType<typeof trpc>;
	} = $props();

	const pkquery = rpc.keyManagement.getUserPublicKeys.createQuery(void 0);
</script>

<Card.Root class="mt-4">
	<Card.Header class="flex-row justify-between">
		<div class="flex flex-col space-y-1.5">
			<Card.Title>Key Management</Card.Title>
			<Card.Description>
				Manage your keys, and how they're used
			</Card.Description>
		</div>

		<div>
			<CreateKeyDialog {rpc} />
		</div>
	</Card.Header>

	<Card.Content>
		{#if $pkquery.isPending}
			<div class="w-fill grid h-24 place-items-center">
				<AnimatedLoading />
			</div>
		{:else if $pkquery.isError}
			<div class="w-fill flex h-24 flex-col items-center justify-center">
				{#if $pkquery.isRefetching}
					<AnimatedLoading
						class="mb-4 h-6 w-6 text-destructive-foreground"
					/>
				{:else}
					<ErrorX
						class="mb-4 cursor-pointer text-destructive-foreground hover:text-destructive"
						onclick={() => {
							$pkquery.refetch();
						}}
					/>
				{/if}

				<span class={cn($pkquery.isRefetching ? "opacity-60" : "")}>
					RPC Error: <code
						class="rounded-sm bg-slate-300/20 p-1 font-mono"
					>
						{$pkquery.error.data?.code || "UNKNOWN"}
					</code>
				</span>
			</div>
		{:else}
			{JSON.stringify($pkquery.data, null, 2)}
		{/if}
	</Card.Content>
</Card.Root>
