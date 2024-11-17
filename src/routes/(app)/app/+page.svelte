<script lang="ts">
	import Main from "@/main.svelte";

	import { Button } from "$lib/components/ui/button";

	import { toast } from "svelte-sonner";

	import {
		encrypt_blob,
		generate_symmetrical_key,
		unwrap_symmetrical_key,
		wrap_symmetrical_key,
	} from "$lib/client/encryption";
	import {
		import_key_meta,
		import_private_key,
		import_public_key,
		list_public_keys,
	} from "$lib/client/key_management";
	import { arraysEqual } from "$lib/utils";

	const aaaa = () => {
		toast.promise(new Promise((res) => setTimeout(res, 5_000)), {
			loading: "Loading",
			important: true,
			finally: () => {
				toast.success("Done.");
			},
		});
	};

	const do_key_stuff = async () => {
		const sym_key = await generate_symmetrical_key();
		console.log("sym key", sym_key);

		const test_iv = window.crypto.getRandomValues(new Uint8Array(96));
		const test_value = window.crypto.getRandomValues(new Uint8Array(256));

		const original_enc_blob = await encrypt_blob(
			sym_key,
			test_iv,
			test_value,
		);

		const key = list_public_keys()[0];
		const pubkey = await import_public_key(key);
		const privkey = await import_private_key(key);
		const pubkey_meta = import_key_meta("public", key);
		console.log("using key", key, pubkey_meta.name);

		const wrapped_key = await wrap_symmetrical_key(pubkey, sym_key);

		console.log("wrapped key", wrapped_key);

		const unwrapped_key = await unwrap_symmetrical_key(
			privkey,
			wrapped_key,
		);

		const unwrapped_enc_blob = await encrypt_blob(
			unwrapped_key,
			test_iv,
			test_value,
		);

		console.log("unwrapped key", unwrapped_key);

		console.log(
			"original = unwrapped?",
			arraysEqual(original_enc_blob, unwrapped_enc_blob),
			{
				original: original_enc_blob,
				unwrapped: unwrapped_enc_blob,
			},
		);
	};
</script>

<!--Home Page Test-->

<Main class="min-h-app-main max-w-screen-lg">
	<div>
		<h1 class="text-3xl font-bold">Folders</h1>
		<div>
			<!-- Div to store each folder / folder button in-->
			<Button variant="folder">Work</Button>
			<Button variant="destructive">Personal</Button>
			<Button variant="destructive">Photos</Button>
			<Button variant="destructive">Bills</Button>
		</div>
	</div>

	<Button onclick={do_key_stuff}>Do key stuff</Button>

	<!-- {#if $greeter.isLoading}
	loading
	{:else if $greeter.isError}
	is Error
	{:else}
	{$greeter.data}
	{/if} -->

	<Button onclick={aaaa} variant="default">Button</Button>
	<Button variant="destructive">AAAAAAAA</Button>
</Main>
