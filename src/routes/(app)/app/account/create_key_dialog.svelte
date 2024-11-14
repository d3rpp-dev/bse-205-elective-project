<script lang="ts">
	import type { trpc } from "$lib/trpc/client";
	import { buttonVariants } from "@/ui/button";

	import * as Dialog from "@/ui/dialog";
	import * as Tabs from "@/ui/tabs";
	import { Label } from "@/ui/label";
	import { Input } from "@/ui/input";
	import * as Select from "@/ui/select";
	import { Button } from "@/ui/button";

	import { Plus } from "lucide-svelte";

	let tabs_value: "create" | "download" | "error" = $state("create");

	let friendly_name = $state("");
	let keysize = $state("256");

	let {
		rpc,
	}: {
		rpc: ReturnType<typeof trpc>;
	} = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "secondary" })}>
		<Plus class="mr-2" />
		Create Key
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>HEHEHEHA</Dialog.Title>
		</Dialog.Header>
		<Tabs.Root value={tabs_value}>
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
					<Input
						id="friendly_name"
						type="text"
						bind:value={friendly_name}
						placeholder="e.g. My Key"
					/>
				</div>

				<div class="flex flex-col gap-2">
					<Label for="keysize">Size</Label>
					<Select.Root
						type="single"
						name="keysize"
						bind:value={keysize}
					>
						<Select.Trigger id="keysize">
							{keysize}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="128" label="128" />
							<Select.Item value="192" label="192" />
							<Select.Item value="256" label="256" />
						</Select.Content>
					</Select.Root>
				</div>

				<Button class="mt-4"><Plus class="mr-2" />Create Key</Button>
			</Tabs.Content>
			<Tabs.Content value="error">error</Tabs.Content>
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>
