<script lang="ts">
	import { cn } from "$lib/utils";
	import { trpc } from "$lib/trpc/client";
	import { page } from "$app/stores";

	import Main from "@/main.svelte";

	import * as Avatar from "@/ui/avatar";
	import * as Card from "@/ui/card";

	import KeyManagermentSection from "./key_managerment_section.svelte";
	import { AnimatedLoading } from "$lib/icons";

	import { CircleX, User } from "lucide-svelte";
	import { toast } from "svelte-sonner";

	const { data } = $props();
	const { user } = data;

	const rpc = trpc($page);

	const uploadedFileCount = data.uploadedFileCount();
</script>

<Main class="min-h-app-main max-w-screen-lg">
	<!-- #region Account Info Header
      -->
	<div class="flex h-[240px] flex-col items-center justify-start md:flex-row">
		<div class="grid aspect-square size-[240px] place-items-center">
			<Avatar.Root class="aspect-square h-[75%] w-auto">
				{#if user.profilePicture}
					<Avatar.Image
						src={`/api/public_assets/${user.profilePicture}`}
						alt={`Profile Piture for ${user.displayName || user.username}`}
					/>
				{/if}
				<Avatar.Fallback class="h-full w-full">
					<User />
				</Avatar.Fallback>
			</Avatar.Root>
		</div>
		<div class="flex h-[80%] flex-col items-start justify-center gap-2">
			<h1 class="text-4xl">{user.displayName || user.username}</h1>
			<h2 class="inline-flex flex-row text-xl text-muted-foreground">
				<span class="text-muted-foreground/60">@</span>
				{user.username}
			</h2>
		</div>

		<div class="flex-auto"></div>

		<div class="flex flex-col">
			<Card.Root>
				<Card.Content class="text-center">
					<div class="text-md mb-2">Uploaded Files</div>

					<span
						class={cn(
							"flex h-4 w-full items-center justify-center text-muted-foreground",
							$uploadedFileCount.isRefetching
								? "text-muted-foreground/50"
								: null,
						)}
					>
						{#if $uploadedFileCount.isPending}
							<AnimatedLoading />
						{:else if $uploadedFileCount.isError}
							<div class="hidden">
								{toast.error("Error", {
									description: `Failed to Fetch Uploaded File Count: ${$uploadedFileCount.error.data?.code || "Unknown Error"}`,
									cancel: {
										label: "Dismiss",
										onClick: () => {},
									},
								})}
							</div>
							<CircleX
								class="h-4 w-4 text-destructive-foreground"
							/>
						{:else}
							{$uploadedFileCount.data}
						{/if}
					</span>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
	<!-- #endregion -->

	<!-- <Separator orientation="horizontal" class="mx-auto my-4 w-[90%]" /> -->

	<KeyManagermentSection {rpc} />
</Main>
