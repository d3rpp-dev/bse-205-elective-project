<script lang="ts">
	import * as Table from "@/ui/table";
    import * as AlertDialog from "@/ui/alert-dialog";
    import * as Tooltip from "@/ui/tooltip";
    import { Button, buttonVariants } from "@/ui/button";

    import { Pencil, Trash2, Download } from "lucide-svelte";

	import type { MaybePromise } from "$lib/utils";

    let deleteConfirmationOpen = $state(false);

    const {
        kid,
        deleteKey,
        renameKey
    }: {
        kid: string,
        deleteKey: (kid: string) => Promise<void>,
        renameKey: (kid: string, name: string) => MaybePromise<void>
    } = $props();
</script>

<Table.Cell>
    <div class="flex justify-end gap-2">
        <!-- #region Download -->
        <Button variant="ghost" size="icon">
            <Download />
        </Button>
        <!-- #endregion -->

        <!-- #region Rename -->
        <Button variant="ghost" size="icon">
            <Pencil />
        </Button>
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
                    {#snippet child({props})}
                        <AlertDialog.Trigger 
                            class={buttonVariants({
                                variant: "ghost-destructive",
                                size: "icon"
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
                        Are you sure you want to delete this key, once confirmed, it cannot be undone.
                    </AlertDialog.Description>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                    <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                    <AlertDialog.Action onclick={() => deleteKey(kid).then(() => deleteConfirmationOpen = false)}>Continue</AlertDialog.Action>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog.Root>
        <!-- #endregion -->
    </div>
</Table.Cell>