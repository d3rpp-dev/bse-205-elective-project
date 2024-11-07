<script lang="ts">
	import { cn } from "$lib/utils";
	import type { trpc } from "$lib/trpc/client";

	import AnimatedLoading from "$lib/icons/AnimatedLoading.svelte";
	import ErrorX from "lucide-svelte/icons/x";

	import md5 from "md5";

	import CreateKeyDialog from "./create_key_dialog.svelte";

	import * as Card from "@/ui/card";
	import * as Table from "@/ui/table";
	import InlineCodeblock from "@/inline-codeblock.svelte";

	const {
		rpc,
	}: {
		rpc: ReturnType<typeof trpc>;
	} = $props();

	// `void 0` is identical to `undefined`, I'm just funny
	const pkquery = rpc.keyManagement.getUserPublicKeys.createQuery(void 0);

	const create_md5_fingerprint = (key: Uint8Array): string => {
		return md5(key).match(/..?/g)!.join(":");
	};
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
			<CreateKeyDialog
				{rpc}
				reset_pk_query={() => {
					$pkquery.refetch();
				}}
			/>
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
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Key Name</Table.Head>
						<Table.Head>Key ID & Fingerprint</Table.Head>
						<Table.Head>Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each $pkquery.data as key (key.kid)}
						<Table.Row>
							<Table.Cell>{key.name}</Table.Cell>
							<Table.Cell class="flex flex-col gap-2">
								<span>
									Key ID: <InlineCodeblock>
										{key.kid}
									</InlineCodeblock>
								</span>
								<span>
									Fingerprint: <InlineCodeblock>
										{create_md5_fingerprint(
											key.key as Uint8Array,
										)}
									</InlineCodeblock>
								</span>
							</Table.Cell>
							<Table.Cell>Actions (todo)</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
				<Table.Footer>
					<Table.Row>
						<Table.Cell colspan={2}>Total Key Count</Table.Cell>
						<Table.Cell>{$pkquery.data.length}</Table.Cell>
					</Table.Row>
				</Table.Footer>
			</Table.Root>
		{/if}
	</Card.Content>
</Card.Root>
