<script lang="ts">
	import type { trpc } from "$lib/trpc/client";

	import * as Card from "@/ui/card";
	import * as Tooltip from "@/ui/tooltip";
	import { Button } from "@/ui/button";

	import { filesize } from "filesize";
	import { AnimatedLoading } from "$lib/icons";
	import { Download, X } from "lucide-svelte";

	import { import_private_key } from "$lib/client/key_management";
	import {
		unwrap_symmetrical_key,
		decrypt_blob,
	} from "$lib/client/encryption";

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

	// screw it, we'll just download ALL OF THEM EVERY TIME
	const symkeyQuery = rpc.blobManagement.downloadSymmeticKey.createQuery({
		kid: file.id,
	});

	let isBusy = $state(false);
	let isLoading = $derived(
		isBusy || $symkeyQuery.isLoading || $symkeyQuery.isError,
	);

	const decodeB64Blob = (b64: string): Uint8Array => {
		const binaryString = atob(b64);
		let bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		return bytes;
	};

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
	<Card.Footer>
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
	</Card.Footer>
</Card.Root>
