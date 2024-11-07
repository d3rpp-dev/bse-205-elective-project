<script lang="ts">
	import type { trpc } from "$lib/trpc/client";

	import * as Dialog from "@/ui/dialog";
	import * as Tabs from "@/ui/tabs";
	import { Label } from "@/ui/label";
	import { Input } from "@/ui/input";
	import * as Select from "@/ui/select";
	import { Button, buttonVariants } from "@/ui/button";

	import { Plus } from "lucide-svelte";
	import AnimatedLoading from "$lib/icons/AnimatedLoading.svelte";

	import { getRuntimeClientContext } from "$lib/client";
	import { onMount } from "svelte";
	import InlineCodeblock from "@/inline-codeblock.svelte";

	let tabs_value: "create" | "download" = $state("create");

	let friendly_name = $state("");
	let friendly_name_error: string | null = $state(null);

	let hash: "SHA-256" | "SHA-384" | "SHA-512" = $state("SHA-256");
	let hash_error: string | null = $state(null);

	let modulus: "2048" | "3072" | "4096" | "8192" = $state("4096");
	let modulus_error: string | null = $state(null);

	let error: string | null = $state(null);
	let final_kid: string | null = $state(null);

	let open = $state(false);
	// start on 1 for the key reservation
	let isLoading = $state(1);
	// should button be disable for some other reason
	let buttonDisabled = $state(false);

	let key_pair_encoded_download_blob: string | null = $state(null);

	let {
		rpc,
		reset_pk_query,
	}: {
		rpc: ReturnType<typeof trpc>;
		reset_pk_query: () => void;
	} = $props();

	const uploadKeySuccess = async () => {
		$reserveKeyMutatuion.reset();

		const exported_key = await amalgamation.export_key_string(final_kid!);
		console.debug("Exported Key from upload success", { exported_key });
		if (!exported_key) return;

		console.log({ exported_key });

		const blob = new Blob([exported_key], { type: "application/json" });
		key_pair_encoded_download_blob = window.URL.createObjectURL(blob);

		tabs_value = "download";
		reset_pk_query();
	};

	// button cannot be pressed without the values being valid
	//
	// so I won't bother with validation here.
	const onCreateKey = async () => {
		isLoading += 1;

		const kid = (await $reserveKeyMutatuion.mutateAsync(void 0)).kid;

		try {
			const confirmed_kid = await amalgamation.generate_key_pair(kid, {
				name: "RSA-OAEP",
				hash,
				// it is recommende to just do this unless you have a VERY good reason not to.
				publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
				// `+` like this just parses it to an integer
				modulusLength: +modulus,
			});

			final_kid = confirmed_kid;

			const exported_key =
				await amalgamation.export_public_key(confirmed_kid);

			console.log("Exported from Amalgamation", { exported_key });
			console.log("b64", btoa(JSON.stringify(exported_key)));

			$uploadKeyMutation.mutate({
				name: friendly_name,
				kid: confirmed_kid,
				key_b64: btoa(JSON.stringify(exported_key)),
			});
		} catch (e: unknown) {
			if (e instanceof DOMException) {
				error = e.message;
			} else {
				console.error("error during keygen", e);
			}
		}
	};

	const amalgamation = getRuntimeClientContext();
	const uploadKeyMutation = rpc.keyManagement.uploadPublicKey.createMutation({
		onSuccess: uploadKeySuccess,

		onError: (err) => {
			error = err.message;
		},
	});

	const reserveKeyMutatuion = rpc.keyManagement.reserveKID.createMutation({
		onSuccess: (data) => {
			console.log({ data });
			isLoading -= 1;
		},

		onError: (err) => {
			buttonDisabled = true;
			error = err.message;
		},
	});

	onMount(() => {
		$reserveKeyMutatuion.mutate();
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: "secondary" })}>
		<Plus class="mr-2" />
		Create Key
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>HEHEHEHA</Dialog.Title>
		</Dialog.Header>
		<Tabs.Root value={tabs_value}>
			<Tabs.Content value="create">
				<div class="flex flex-col">
					<Label class="mb-2" for="friendly_name">
						Name
						<span class="align-super text-destructive">*</span>
					</Label>
					<Input
						id="friendly_name"
						type="text"
						bind:value={friendly_name}
						placeholder="e.g. My Key"
						onkeyup={() => {
							console.log(friendly_name);

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
						If you don't know what this means, just use <InlineCodeblock
						>
							SHA-256
						</InlineCodeblock>
					</span>
				</div>

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
						If you don't know what this means, just use <InlineCodeblock
						>
							4096
						</InlineCodeblock>
					</span>
				</div>

				<Button
					class="mt-4"
					onclick={onCreateKey}
					disabled={friendly_name_error != null ||
						hash_error != null ||
						modulus_error != null ||
						friendly_name.trim().length == 0 ||
						isLoading > 0 ||
						buttonDisabled}
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
				>
					{#if key_pair_encoded_download_blob == null}
						<AnimatedLoading />
					{:else}
						Download Key
					{/if}
				</Button>
			</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>
