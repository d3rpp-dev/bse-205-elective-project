<script lang="ts">
	import type { trpc } from "$lib/trpc/client";

	import * as Card from "@/ui/card";
	import * as Tooltip from "@/ui/tooltip";
	import * as AlertDialog from "@/ui/alert-dialog";
	import { Button, buttonVariants } from "@/ui/button";
	import { Input } from "@/ui/input";

	import { AnimatedLoading } from "$lib/icons";
	import { Download, X, Trash2, PenBoxIcon } from "lucide-svelte";

	import { import_private_key } from "$lib/client/key_management";
	import {
		unwrap_symmetrical_key,
		decrypt_blob,
	} from "$lib/client/encryption";

	import { toast } from "svelte-sonner";
	import { filesize } from "filesize";

	interface File {
		name: string;
		size: number;
		id: string;
		owner: boolean;
		iv: string;
	}

	const {
		file,
		rpc,
	}: {
		file: File;
		rpc: ReturnType<typeof trpc>;
	} = $props();

	const utils = rpc.createUtils();

	// screw it, we'll just download ALL OF THEM EVERY TIME
	const symkeyQuery = rpc.blobManagement.downloadSymmeticKey.createQuery({
		kid: file.id,
	});

	const renameFileMutation = rpc.blobManagement.renameBlob.createMutation();
	const deleteFileMutation = rpc.blobManagement.deleteBlob.createMutation();

	let isBusy = $state(false);
	let isDeleting = $state(false);
	let isRenaming = $state(false);
	let isLoading = $derived(
		isBusy ||
			isDeleting ||
			isRenaming ||
			$symkeyQuery.isLoading ||
			$symkeyQuery.isError ||
			$renameFileMutation.isPending ||
			$deleteFileMutation.isPending,
	);

	let renameValue = $state("");

	let renameAlertOpen = $state(false);
	let deleteAlertOpen = $state(false);

	const decodeB64Blob = (b64: string): Uint8Array => {
		const binaryString = atob(b64);
		let bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes;
	};

	// #region download file
	const downloadFile = async () => {
		try {
			isBusy = true;
			console.group("Downloading File");

			const key_data = $symkeyQuery.data;
			if (!key_data) return;

			const { key_b64, pubkey } = key_data;

			console.log("Got past we have key check");

			const wrapped_key = decodeB64Blob(key_b64 as string);
			const unwraping_key = await import_private_key(pubkey);

			console.log("unwrapping symmetrical key");

			const unwrapped_key = await unwrap_symmetrical_key(
				unwraping_key,
				wrapped_key,
			);

			console.log("fetching encrypted blob");

			const response = await fetch(`/api/blobs/${file.id}`);
			const response_blob = await response.arrayBuffer();

			console.log("decrypting blob");

			const iv = decodeB64Blob(file.iv);
			const decrypted_blob = await decrypt_blob(
				unwrapped_key,
				iv,
				response_blob,
			);

			console.log("downloading blob");

			const file_blob = new Blob([decrypted_blob]);
			const url = window.URL.createObjectURL(file_blob);

			const anchor = document.createElement("a");
			anchor.style.display = "none";
			anchor.setAttribute("href", url);
			anchor.setAttribute("download", file.name);

			document.body.appendChild(anchor);

			anchor.click();

			document.body.removeChild(anchor);

			console.info("Done");
		} catch (e) {
			console.info("Failed");
			console.error(e);
		}

		console.groupEnd();

		isBusy = false;
	};
	// #endregion
	// #region rename file
	const renameFile = async () => {
		isRenaming = true;

		await $renameFileMutation.mutateAsync({
			blob_id: file.id,
			new_name: renameValue,
		});

		utils.user.fetchUploadedFileMetadata.refetch();

		toast.success("Renamed File successfully");

		renameAlertOpen = false;
		isRenaming = false;
		renameValue = "";
	};
	// #endregion
	// #region delete file
	const deleteFile = async () => {
		isDeleting = true;

		await $deleteFileMutation.mutateAsync({
			blob_id: file.id,
		});

		utils.user.fetchUploadedFileMetadata.refetch();

		toast.success("Deleted File siccessfully");

		deleteAlertOpen = false;
		isDeleting = false;
	};
	// #endregion
</script>

<Card.Root class="w-72">
	<Card.Header>
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<div
						class="overflow-hidden text-ellipsis text-nowrap"
						{...props}
					>
						{file.name}
					</div>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>{file.name}</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</Card.Header>
	<Card.Content>
		{filesize(file.size)}
	</Card.Content>
	<Card.Footer class="flex flex-row justify-end">
		<Button
			size="icon"
			variant="ghost"
			disabled={isLoading}
			onmouseup={downloadFile}
		>
			{#if isLoading}
				<AnimatedLoading />
			{:else if $symkeyQuery.isError}
				<X class="text-destructive-foreground" />
			{:else}
				<Download />
			{/if}
		</Button>
		<AlertDialog.Root bind:open={renameAlertOpen}>
			<AlertDialog.Trigger>
				{#snippet child({ props })}
					<Button
						disabled={isLoading}
						size="icon"
						variant="ghost"
						{...props}
					>
						<PenBoxIcon />
					</Button>
				{/snippet}
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>
						What would you like to rename this to?
					</AlertDialog.Title>
				</AlertDialog.Header>
				<Input
					name="rename_file"
					bind:value={renameValue}
					placeholder="New name"
				/>
				<AlertDialog.Footer>
					<AlertDialog.Cancel
						class={buttonVariants({
							variant: "outline",
						})}
						onmouseup={() => (renameValue = "")}
					>
						Cancel
					</AlertDialog.Cancel>
					<AlertDialog.Action
						disabled={renameValue.length < 3 || isRenaming}
						class={buttonVariants({
							variant: "default",
							class: "w-24",
						})}
						onmouseup={renameFile}
					>
						{#if isRenaming}
							<AnimatedLoading />
						{:else}
							Rename
						{/if}
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
		<AlertDialog.Root bind:open={deleteAlertOpen}>
			<AlertDialog.Trigger>
				{#snippet child({ props })}
					<Button
						disabled={isLoading}
						size="icon"
						variant="ghost-destructive"
						{...props}
					>
						<Trash2 />
					</Button>
				{/snippet}
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>
						Are you sure you want to delete this file?
					</AlertDialog.Title>
					<AlertDialog.Description>
						You cannot undo this action.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel
						class={buttonVariants({
							variant: "outline",
						})}
					>
						Cancel
					</AlertDialog.Cancel>
					<AlertDialog.Action
						disabled={isDeleting}
						class={buttonVariants({
							variant: "destructive",
							class: "w-24",
						})}
						onmouseup={deleteFile}
					>
						{#if isDeleting}
							<AnimatedLoading />
						{:else}
							<span class="text-foreground">Delete</span>
						{/if}
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</Card.Footer>
</Card.Root>
