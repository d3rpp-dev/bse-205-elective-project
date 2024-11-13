<script lang="ts">
	import * as Table from "@/ui/table";
	import { Input } from "@/ui/input";
	import Button from "@/ui/button/button.svelte";

	import { Check, X } from "lucide-svelte";
	import { cn } from "$lib/utils";
	import { AnimatedLoading } from "$lib/icons";
	import { toast } from "svelte-sonner";

	let {
		name,
		isRenaming = $bindable(false),
		updateNameCallback,
		cancelRename,
	}: {
		name: string;
		isRenaming: boolean;
		updateNameCallback: (new_name: string) => Promise<string>;
		cancelRename: () => void;
	} = $props();

	let name_value = $state(name);
	let loading = $state(false);

	const renameKeyRunCallback = async () => {
		loading = true;

		try {
			await updateNameCallback(name_value);
			name = name_value;
		} catch (e) {
			name_value = name;
            toast.error(`Failed to rename key. Check Console`);
            console.error('Failed to rename key', e);
		}

        toast.success(`Renamed key to ${name_value}`);
		loading = false;
	};
</script>

<Table.Cell>
	{#if isRenaming && !loading}
		<span class="inline-flex gap-1">
			<Input type="text" class="w-[10.5rem]" bind:value={name_value} />
			<Button
				variant="ghost"
				size="icon"
				class="aspect-square"
				onmouseup={renameKeyRunCallback}
			>
				<Check />
			</Button>
			<Button
				variant="ghost-destructive"
				class="aspect-square"
				size="icon"
				onmouseup={cancelRename}
			>
				<X />
			</Button>
		</span>
	{:else}
		<span class="inline-flex flex-row justify-between">
			<span
				class={cn(
					"block",
					loading ? "w-[15rem]" : "w-[16rem]",
					loading && "opacity-75",
				)}
			>
				{name_value}
			</span>
			{#if loading}
				<AnimatedLoading />
			{/if}
		</span>
	{/if}
</Table.Cell>
