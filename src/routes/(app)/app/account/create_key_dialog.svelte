<script lang="ts">
	import type { trpc } from "$lib/trpc/client";
	import { TRPCClientError } from "@trpc/client";

	import * as AlertDialog from "@/ui/alert-dialog";
	import * as Tabs from "@/ui/tabs";
	import { Label } from "@/ui/label";
	import { Input } from "@/ui/input";
	import * as Select from "@/ui/select";
<<<<<<< HEAD
	import { Button } from "@/ui/button";
=======
	import { Button, buttonVariants } from "@/ui/button";
	import InlineCodeBlock from "@/inline-codeblock.svelte";
>>>>>>> cd6736bb39d0423671ae1834afa4f5a47e45f3a7

	import { Plus } from "lucide-svelte";
	import AnimatedLoading from "$lib/icons/AnimatedLoading.svelte";

	import {
		generate_rsa_key_pair,
		save_key_pair,
		export_single_key_string,
		export_key_pair_string,
		delete_key,
	} from "$lib/client/key_management";

	import { toast } from "svelte-sonner";

	import { onMount } from "svelte";

	let tabs_value: "create" | "download" = $state("create");

	let friendly_name = $state("");
	let friendly_name_error: string | null = $state(null);

	let hash: "SHA-256" | "SHA-384" | "SHA-512" = $state("SHA-256");
	let hash_error: string | null = $state(null);

	let modulus: "2048" | "3072" | "4096" | "8192" = $state("4096");
	let modulus_error: string | null = $state(null);

	let error: string | null = $state(null);

	let open = $state(false);
	// start on 1 for the key reservation
	let isLoading = $state(0);
	// should button be disabled for some other reason
	let buttonDisabled = $state(false);

	let final_kid: string | null = $state(null);

	let key_pair_encoded_download_blob: string | null = $state(null);

	let {
		rpc,
		reset_pk_query,
		upload_pk,
	}: {
		rpc: ReturnType<typeof trpc>;
		reset_pk_query: () => void;
		upload_pk: (args: {
			name: string;
			kid: string;
			key_b64: string;
		}) => Promise<void>;
	} = $props();

	const reservedKIDQuery = rpc.keyManagement.reserveKID.createMutation();

	const resetDialog = () => {
		friendly_name = "";
		hash = "SHA-256";
		modulus = "2048";
	};

	const generateKeyOnclick = async (kid: string) => {
		isLoading++;

		final_kid = kid;
		const key_pair = await generate_rsa_key_pair({
			hash,
			kid,
			modulusLength: +modulus,
			name: friendly_name,
		});

		await save_key_pair(key_pair);
		const public_key = key_pair.publicKey;
		const exported_public_key = await export_single_key_string(public_key);

		try {
			await upload_pk({
				name: friendly_name,
				kid,
				key_b64: btoa(exported_public_key),
			});

			reset_pk_query();
		} catch (e: unknown) {
			toast.error("Failed to upload key");

			// rolling back generated key
			delete_key(kid);

			if (e instanceof TRPCClientError) {
				error = e.message;
			} else {
				console.error(e);
			}

			return;
		}

		let key_pair_export;

		try {
			key_pair_export = await export_key_pair_string(kid);
		} catch (e) {
			console.error(e);
			toast.error("An error occured");
			return;
		}

		try {
			const text_encoder = new TextEncoder();
			const key_blob = new Blob([text_encoder.encode(key_pair_export)], {
				type: "application/json",
			});

			key_pair_encoded_download_blob =
				window.URL.createObjectURL(key_blob);
		} catch (e: unknown) {
			buttonDisabled = true;
			isLoading--;

			console.error(e);
			toast.error("An error occured");
			return;
		}

		tabs_value = "download";
		resetDialog();
	};

	onMount(async () => {
		isLoading += 1;
		$reservedKIDQuery.mutateAsync();
		isLoading -= 1;
	});
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger class={buttonVariants({ variant: "secondary" })}>
		<Plus class="mr-2" />
		Create Key
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Create Key</AlertDialog.Title>
		</AlertDialog.Header>
		<Tabs.Root value={tabs_value}>
<<<<<<< HEAD
			<Tabs.List class="w-full">
				<Tabs.Trigger class="w-full" value="create" disabled>
					Create
				</Tabs.Trigger>
				<Tabs.Trigger class="w-full" value="download" disabled>
					Download
				</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="create" class="flex flex-col gap-4 px-4 pt-8">
				<div class="flex flex-col gap-2">
					<Label for="friendly_name">Name</Label>
=======
			<Tabs.Content value="create">
				<div class="flex flex-col">
					<Label class="mb-2" for="friendly_name">
						Name
						<span class="align-super text-destructive">*</span>
					</Label>
>>>>>>> cd6736bb39d0423671ae1834afa4f5a47e45f3a7
					<Input
						id="friendly_name"
						type="text"
						bind:value={friendly_name}
						placeholder="e.g. My Key"
						onkeyup={() => {
							friendly_name_error =
								friendly_name.trim().length === 0
									? "Key Name must not be empty"
									: null;
						}}
					/>

					{#if friendly_name_error}
						<span class="text-sm text-destructive-foreground">
							{friendly_name_error}
						</span>
					{/if}
				</div>

				<div class="flex flex-col gap-2">
					<Label for="hash">
						Hash
						<span class="align-super text-destructive">*</span>
					</Label>
					<Select.Root
						type="single"
						name="keysize"
						bind:value={hash}
						onValueChange={() => {
							hash_error = ![
								"SHA-256",
								"SHA-384",
								"SHA-512",
							].includes(hash)
								? "Invalid Hash"
								: null;
						}}
					>
						<Select.Trigger id="hash">
							{hash}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="SHA-256" label="SHA-256" />
							<Select.Item value="SHA-384" label="SHA-384" />
							<Select.Item value="SHA-512" label="SHA-512" />
						</Select.Content>
					</Select.Root>
					<span class="text-sm opacity-50">
						If you don't know what this means, just use
						<InlineCodeBlock>SHA-256</InlineCodeBlock>
					</span>
				</div>

<<<<<<< HEAD
				<Button class="mt-4"><Plus class="mr-2" />Create Key</Button>
=======
				<div class="flex flex-col gap-2">
					<Label for="modulus">
						Modulus
						<span class="align-super text-destructive">*</span>
					</Label>
					<Select.Root
						type="single"
						name="modulus"
						bind:value={modulus}
						onValueChange={() => {
							modulus_error = ![
								"2048",
								"3072",
								"4096",
								"8192",
							].includes(modulus)
								? "Invalid Modulus"
								: null;
						}}
					>
						<Select.Trigger id="hash">
							{modulus}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="2048" label="2048" />
							<Select.Item value="3072" label="3072" />
							<Select.Item value="4096" label="4096" />
							<Select.Item value="8129" label="8192" />
						</Select.Content>
					</Select.Root>
					<span class="text-sm opacity-50">
						If you don't know what this means, just use <InlineCodeBlock
						>
							4096
						</InlineCodeBlock>
					</span>
				</div>

				<Button
					class="mt-4"
					onclick={() =>
						generateKeyOnclick($reservedKIDQuery.data!.kid)}
					disabled={friendly_name_error != null ||
						hash_error != null ||
						modulus_error != null ||
						friendly_name.trim().length === 0 ||
						isLoading > 0 ||
						buttonDisabled ||
						!$reservedKIDQuery.isSuccess}
				>
					{#if isLoading}
						<AnimatedLoading />
					{:else}
						<Plus class="mr-2" />Create Key
					{/if}
				</Button>

				{#if error != null}
					<div
						class="rounded-md border-2 border-destructive-foreground bg-destructive/60 p-4 transition-height"
					>
						{error}
					</div>
				{/if}
			</Tabs.Content>

			<Tabs.Content value="download">
				<Button
					class="w-full"
					disabled={key_pair_encoded_download_blob == null}
					href={key_pair_encoded_download_blob}
					download={`${final_kid!}.json`}
					onclick={() => {
						open = false;
						tabs_value = "create";
						resetDialog();
					}}
				>
					{#if key_pair_encoded_download_blob == null}
						<AnimatedLoading />
					{:else}
						Download Key
					{/if}
				</Button>
>>>>>>> cd6736bb39d0423671ae1834afa4f5a47e45f3a7
			</Tabs.Content>
		</Tabs.Root>
	</AlertDialog.Content>
</AlertDialog.Root>
