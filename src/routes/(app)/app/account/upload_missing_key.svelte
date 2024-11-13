<script lang="ts">
	import { load_key_pair_from_string } from "$lib/client/key_management";
	import { buttonVariants } from "@/ui/button";
	import * as Tooltip from "@/ui/tooltip";
	import { Upload } from "lucide-svelte";
	import { toast } from "svelte-sonner";

	let input_ref: HTMLInputElement;

	const {
		expected_kid,
	}: {
		expected_kid: string;
	} = $props();

	const handle_file_upload = async (event: Event) => {
		if (
			event.target instanceof HTMLInputElement &&
			event.target.files &&
			event.target.files.length > 0
		) {
			const file = event.target.files![0];

			const reader = new FileReader();
			reader.onload = () => {
				load_key_pair_from_string(
					reader.result as string,
					expected_kid,
				);

				toast.success(`Loaded key succesfully`);
			};
			reader.readAsText(file);
		}
	};
</script>

<input
	bind:this={input_ref}
	class="hidden"
	type="file"
	accept=".json"
	onchange={handle_file_upload}
/>

<Tooltip.Root>
	<Tooltip.Trigger
		class={buttonVariants({
			variant: "ghost",
			size: "icon",
		})}
	>
		<Upload class="mx-auto text-orange-600" />
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>Public Key uploaded, key is ready for use.</p>
	</Tooltip.Content>
</Tooltip.Root>
