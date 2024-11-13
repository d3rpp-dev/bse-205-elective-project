<script lang="ts">
	import * as Table from "@/ui/table";
	import * as AlertDialog from "@/ui/alert-dialog";
	import * as Tooltip from "@/ui/tooltip";
	import { buttonVariants } from "@/ui/button";

	import { Pencil, Trash2, Download } from "lucide-svelte";
	import { export_key_pair_string } from "$lib/client/key_management";
	import { toast } from "svelte-sonner";

	let deleteConfirmationOpen = $state(false);

	const {
		kid,
		deleteKey,
		renameKey,
	}: {
		kid: string;
		deleteKey: (kid: string) => Promise<void>;
		renameKey: (kid: string) => void;
	} = $props();

    const downloadKey = async () => {
        const exported_key_pair = await export_key_pair_string(kid);
        const text_encoder = new TextEncoder();
			const key_blob = new Blob([text_encoder.encode(exported_key_pair)], {
				type: "application/json",
			});

        let element = window.document.createElement('a');
        element.style.display = 'none';
        element.href = window.URL.createObjectURL(key_blob)
        element.download = `${kid}.json`;

        toast.success(`Downloading Key...`);

        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
</script>

<Table.Cell>
	<div class="flex justify-end gap-2">
		<!-- #region Download -->
        <Tooltip.Root>
			<Tooltip.Trigger
				onmouseup={downloadKey}
				class={buttonVariants({
					variant: "ghost",
					size: "icon",
				})}
			>
				<Download />
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Download this key pair</p>
			</Tooltip.Content>
		</Tooltip.Root>
		<!-- #endregion -->

		<!-- #region Rename -->
		<Tooltip.Root>
			<Tooltip.Trigger
				onmouseup={() => renameKey(kid)}
				class={buttonVariants({
					variant: "ghost",
					size: "icon",
				})}
			>
				<Pencil />
			</Tooltip.Trigger>
			<Tooltip.Content>
				<p>Rename this key</p>
			</Tooltip.Content>
		</Tooltip.Root>
		<!-- #endregion -->

		<!-- #region Delete -->
		<AlertDialog.Root open={deleteConfirmationOpen}>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<!-- 
                        Tooltip.Trigger doesnt have a click handler, 
                        AlertDialog.Trigger does.

                        Therefore i can put all the triggers on one element
                        and get away with it.
                    -->
					{#snippet child({ props })}
						<AlertDialog.Trigger
							class={buttonVariants({
								variant: "ghost-destructive",
								size: "icon",
							})}
							{...props}
						>
							<Trash2 />
						</AlertDialog.Trigger>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Delete this key</p>
				</Tooltip.Content>
			</Tooltip.Root>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Are you sure?</AlertDialog.Title>
					<AlertDialog.Description>
						Are you sure you want to delete this key, once
						confirmed, it cannot be undone.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					<AlertDialog.Action
						onclick={() =>
							deleteKey(kid).finally(() => (deleteConfirmationOpen = false))}
					>
						Continue
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
		<!-- #endregion -->
	</div>
</Table.Cell>
