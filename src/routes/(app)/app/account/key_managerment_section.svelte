<script lang="ts">
	import { onMount } from "svelte";

	import { cn } from "$lib/utils";
	import type { trpc } from "$lib/trpc/client";

	import AnimatedLoading from "$lib/icons/AnimatedLoading.svelte";
	import { FileQuestion, X, Check } from "lucide-svelte";

	import CreateKeyDialog from "./create_key_dialog.svelte";

	import * as Card from "@/ui/card";
	import * as Table from "@/ui/table";
	import * as Tooltip from "@/ui/tooltip";
	import InlineCodeblock from "@/inline-codeblock.svelte";

	import {
		delete_key,
		export_single_key_string,
		import_key_meta,
		import_public_key,
		list_public_keys,
		rename_key_pair,
	} from "$lib/client/key_management";

	import { kid_to_fingerprint } from "$lib/client/key_fingerprint";
	import { buttonVariants } from "@/ui/button";
	import { toast } from "svelte-sonner";
	import KeyActions from "./key_actions.svelte";
	import KeyName from "./key_name.svelte";
	import UploadMissingKey from "./upload_missing_key.svelte";

	const {
		rpc,
	}: {
		rpc: ReturnType<typeof trpc>;
	} = $props();

	// `void 0` is identical to `undefined`, I'm just funny
	const pkquery = rpc.keyManagement.getUserPublicKeys.createQuery(void 0);

	const uploadKeyMutation =
		rpc.keyManagement.uploadPublicKey.createMutation();

	const deleteKeyMutation =
		rpc.keyManagement.deletePublicKey.createMutation();

	const renameKeyMutation = rpc.keyManagement.renameKey.createMutation();

	let key_list: ReturnType<typeof list_public_keys> | null = $state(null);
	let keys_being_renamed: string[] = $state([]);

	onMount(() => {
		key_list = list_public_keys();
	});

	// #region Upload Key
	const uploadKey = async (kid: string, name: string) => {
		await $uploadKeyMutation.mutateAsync({
			kid,
			name,
			key_b64: btoa(
				await export_single_key_string(await import_public_key(kid)),
			),
		});

		$pkquery.refetch();

		toast.success(`Succesfully uploaded public key`);
	};
	// #endregion
	// #region Delete Key
	const deleteKey = async (kid: string) => {
		try {
			await $deleteKeyMutation.mutateAsync({
				kid,
			});

            delete_key(kid);
            key_list = list_public_keys();
		} catch (e: unknown) {
            toast.error(`Failed to delete key`);
            console.error(e);
        }

		$pkquery.refetch();
	};
	// #endregion
	// #region Handle RenameKey
	const handleRenameKeyCall = (kid: string) => {
		keys_being_renamed.push(kid);
	};

	const confirmKeyRename = async (
		kid: string,
		new_name: string,
	): Promise<string> => {
        const confirmed_name = await $renameKeyMutation.mutateAsync({
            kid, new_name
        });

        await rename_key_pair(kid, confirmed_name);

		key_list = list_public_keys();

		// ironic
		cancelKeyRename(kid);
		return confirmed_name;
	};

	const cancelKeyRename = (kid: string) => {
		keys_being_renamed = keys_being_renamed.filter((val) => val != kid);
	};
	// #endregion
</script>

{#snippet tableRow({
	kid,
	name,
	keyNotStored,
}: Omit<ReturnType<typeof import_key_meta>, "alg"> & {
	keyNotStored?: boolean;
})}
	<Table.Row>
		<!-- #region Table Row Snippet -->
		<!-- #region Status -->
		<Table.Cell>
			{#if $pkquery.isLoading || $pkquery.isRefetching}
				<AnimatedLoading class="mx-auto" />
			{:else if $pkquery.isError}
				<Tooltip.Root>
					<Tooltip.Trigger class="mx-auto block">
						<X class="mx-auto text-destructive" />
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Unable to fetch key status</p>
					</Tooltip.Content>
				</Tooltip.Root>
			{:else if keyNotStored === true}
				<!--  todo: let user upload key -->
                <UploadMissingKey expected_kid={kid} />
			{:else if $pkquery.data!.find((val) => val.kid === kid) !== undefined}
				<!-- #region Status / OK -->
				<Tooltip.Root>
					<Tooltip.Trigger class="mx-auto block">
						<Check class="mx-auto text-green-600" />
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Public Key uploaded, key is ready for use.</p>
					</Tooltip.Content>
				</Tooltip.Root>
				<!-- #endregion -->
			{:else}
				<!-- #region Status / Upload -->
				<Tooltip.Root>
					<Tooltip.Trigger
						class={cn(
							buttonVariants({
								variant: "ghost",
								size: "icon",
							}),
							"mx-auto block",
						)}
						disabled={$uploadKeyMutation.isPending}
						onclick={() => uploadKey(kid, name)}
					>
						<FileQuestion class="mx-auto" />
					</Tooltip.Trigger>
					<Tooltip.Content>
						<p>Public Key is not uploaded, click here to upload.</p>
					</Tooltip.Content>
				</Tooltip.Root>
				<!-- #endregion -->
			{/if}
		</Table.Cell>
		<!-- #endregion -->
		<!-- #region Name -->
		<KeyName
			{name}
			isRenaming={keys_being_renamed.includes(kid)}
			updateNameCallback={(new_name) => confirmKeyRename(kid, new_name)}
			cancelRename={() => cancelKeyRename(kid)}
		/>
		<!-- #endregion -->
		<!-- #region KID & Fingerprint -->
		<Table.Cell class="flex flex-col gap-1">
			<span>Key ID:</span>
			<InlineCodeblock>
				{kid}
			</InlineCodeblock>
			<br />
			<div class="h-2"></div>
			<span>Fingerprint:</span>
			<InlineCodeblock>
				{kid_to_fingerprint("public", kid)}
			</InlineCodeblock>
		</Table.Cell>
		<!-- #endregion -->
		<!-- #region Actions -->
		<KeyActions {kid} {deleteKey} renameKey={handleRenameKeyCall} />
		<!-- #endregion -->
		<!-- #endregion -->
	</Table.Row>
{/snippet}

<!-- #region Component -->
<Tooltip.Provider>
	<Card.Root class="mt-4">
		<Card.Header class="flex-row justify-between">
			<div class="flex flex-col space-y-1.5">
				<Card.Title>Key Management</Card.Title>
				<Card.Description>
					Manage your keys, and how they're algused
				</Card.Description>
			</div>

			<div>
				<CreateKeyDialog
					{rpc}
					reset_pk_query={() => {
						key_list = list_public_keys();
						$pkquery.refetch();
					}}
					upload_pk={async (args) => {
						await $uploadKeyMutation.mutateAsync(args);
					}}
				/>
			</div>
		</Card.Header>

		<Card.Content>
			{#if key_list === null}
				<div class="w-fill grid h-24 place-items-center">
					<AnimatedLoading />
				</div>
			{:else}
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Status</Table.Head>
							<Table.Head>Key Name</Table.Head>
							<Table.Head>Key ID & Fingerprint</Table.Head>
							<Table.Head>Actions</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#key key_list}
                            {#each key_list as key (key)}
                                {@render tableRow(import_key_meta("public", key))}
                            {/each}
							{#if $pkquery.isSuccess}
								<!-- filter out ones uploaded to the server that we don't have the private key for -->
								{#each $pkquery.data.filter(({ kid }) => !(key_list ?? []).includes(kid)) as { kid, name } (kid)}
									{@render tableRow({
										kid,
										name,
										keyNotStored: true,
									})}
								{/each}
							{/if}
						{/key}
					</Table.Body>
					<Table.Footer>
						<Table.Row>
							<Table.Cell colspan={3}>Total Key Count</Table.Cell>
							<Table.Cell>{key_list.length}</Table.Cell>
						</Table.Row>
					</Table.Footer>
				</Table.Root>
			{/if}
		</Card.Content>
	</Card.Root>
</Tooltip.Provider>
<!-- #endregion -->
