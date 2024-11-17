<script lang="ts">
	import { onMount } from "svelte";

	import {
		import_key_meta,
		import_public_key,
		list_private_keys,
	} from "$lib/client/key_management";
	import { cn } from "$lib/utils";

	import * as AlertDialog from "@/ui/alert-dialog";
	import { Button, buttonVariants } from "@/ui/button";
	import { Input } from "@/ui/input";
	import { Label } from "@/ui/label";
	import * as Tooltip from "@/ui/tooltip";
	import * as Select from "@/ui/select";

	import { Upload, X } from "lucide-svelte";
    import AnimatedLoading from "$lib/icons/AnimatedLoading.svelte";

	import { trpc } from "$lib/trpc/client";
	import { page } from "$app/stores";
	import {
		encrypt_blob,
		generate_symmetrical_key,
		wrap_symmetrical_key,
	} from "$lib/client/encryption";
	
	import { toast } from "svelte-sonner";
    import { filesize } from "filesize";


	const rpc = trpc($page);

	let dialogOpen = $state(false);

	let keyToUse: string = $state("");
	let file: File | null = $state(null);
	let file_element: HTMLInputElement | null = $state(null);

	let inputsValid = $derived(keyToUse !== "" && file !== null);

	let isUploading = $state(false);

	const closeAndReset = () => {
		dialogOpen = false;
		file = null;
		if (file_element) file_element.value = "";
		keyToUse = "";
		isUploading = false;
	};

	const startEverythingMutation =
		rpc.keyManagement.uploadSymmetricKeyAndCreateEmptyBlob.createMutation();

	let keyList: ReturnType<typeof import_key_meta>[] = $state([]);

	const generateAndUploadSymkey = async (): Promise<void> => {
		if (file === null || keyToUse === "") return;

		isUploading = true;

		console.group("Uploading Blob");
		console.log("generating key");

		const generated_key = await generate_symmetrical_key();
		const wrapping_key = await import_public_key(keyToUse);

		const wrapped_key = await wrap_symmetrical_key(
			wrapping_key,
			generated_key,
		);
		const iv = window.crypto.getRandomValues(new Uint8Array(96));

		console.log("uploading sym key");

		const file_id = await $startEverythingMutation.mutateAsync({
			file_name: file.name,
			key_b64: btoa(String.fromCharCode(...new Uint8Array(wrapped_key))),
			iv_b64: btoa(String.fromCharCode(...new Uint8Array(iv))),
			pubkey: keyToUse,
		});

		console.log("encrypting and uploading call");

		const encryped_size = await encryptAndUpload(iv, generated_key, file_id);

        toast.success(`Uploaded file ${file.name} (${filesize(encryped_size)})`);
		closeAndReset();
	};

	const encryptAndUpload = async (
		iv: Uint8Array,
		key: CryptoKey,
		id: string,
	): Promise<number> => {
		console.log("reading file");

		const file_content: ArrayBuffer = await new Promise(async (res) => {
			const fr = new FileReader();

			fr.onloadend = (ev) => {
				if (ev.target?.readyState === FileReader.DONE) {
					res(fr.result as ArrayBuffer);
				}
			};

			fr.readAsArrayBuffer(file!);
		});

		console.log(file_content);

		console.log("encrypting file");

		const encrypted_blob = await encrypt_blob(key, iv, file_content);
        const encrypted_size = encrypted_blob.length;

		console.log("uploading file");

		let fd = new FormData();
		fd.append("file", new Blob([encrypted_blob]), "encrypted");

		const response = await fetch(`/api/blobs/${id}`, {
			method: "POST",
			body: fd,
		});

		if (response.status != 204) {
			console.info("upload failed");
            toast.error('failed to upload file, check console.')
		} else {
			console.info("uploaded success");
		}

		console.groupEnd();

        return encrypted_size;
	};

	onMount(() => {
		keyList = list_private_keys().map((kid) =>
			import_key_meta("private", kid),
		);
	});
</script>

<AlertDialog.Root bind:open={dialogOpen}>
	<AlertDialog.Trigger>
		{#snippet child({ props })}
			<Tooltip.Root>
				<Tooltip.Trigger
					{...props}
					class={cn(
						buttonVariants({
							variant: "default",
						}),
						"z-90 fixed bottom-10 left-10 size-16 rounded-full",
					)}
				>
					<Upload class="size-12" />
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Upload File</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{/snippet}
	</AlertDialog.Trigger>

	<AlertDialog.Content>
		<AlertDialog.Header
			class="inline-flex flex-row items-center justify-between"
		>
			<AlertDialog.Title>Upload a File</AlertDialog.Title>
			<Button
				variant="ghost"
				size="icon"
				class="rounded-full"
				onclick={closeAndReset}
			>
				<X />
			</Button>
		</AlertDialog.Header>

		<Label for="file">
			File
			<span class="align-super text-destructive-foreground">*</span>
		</Label>
		<Input
			type="file"
			name="file"
			required
			bind:ref={file_element}
			onchange={(ev) => {
				if (ev.target instanceof HTMLInputElement) {
					file =
						ev.target.files!.length > 0
							? ev.target.files!.item(0)
							: null;
				}
			}}
		/>

		<Label for="key">
			Key
			<span class="align-super text-destructive-foreground">*</span>
		</Label>
		<Select.Root
			type="single"
			allowDeselect={false}
			required
			name="key"
			bind:value={keyToUse}
		>
			<Select.Trigger>
				{keyList.find((val) => val.kid == keyToUse)?.name ||
					"No Key Selected"}
			</Select.Trigger>
			<Select.Content>
				{#each keyList as key (key.kid)}
					<Select.Item label={key.name} value={key.kid}>
						{key.name}
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>

		<span class="text-sm">
			<span class="align-super text-destructive-foreground">*</span>
			<span class="opacity-75">Required</span>
		</span>

		<AlertDialog.Footer>
			<AlertDialog.Cancel class="w-24" onmouseup={closeAndReset}>
				Cancel
			</AlertDialog.Cancel>
			<AlertDialog.Action
				class="w-24"
				disabled={!inputsValid || isUploading}
				onmouseup={generateAndUploadSymkey}
			>
				{#if isUploading}
					<AnimatedLoading />
				{:else}
					Upload
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
