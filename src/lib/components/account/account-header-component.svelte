<script lang="ts">
	import { User } from "lucide-svelte";

	import * as Avatar from "@/ui/avatar";
	import * as DropdownMenu from "@/ui/dropdown-menu";

	import type { User as UserType } from "lucia";
	import { Button } from "@/ui/button";

	interface Props {
		user: UserType | null;
		avatar_size?: "default" | "smol";
	}

	const { user = null, avatar_size = "default" }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Avatar.Root class={avatar_size == "smol" ? "h-8 w-8" : undefined}>
			{#snippet children()}
				{#if user && user.profilePicture}
					<Avatar.Image
						src={`/api/public_assets/${user.profilePicture}`}
						alt="Profile Photo"
					/>
				{/if}
				<Avatar.Fallback><User /></Avatar.Fallback>
			{/snippet}
		</Avatar.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-[350px]">
		{#if user === null}
			<!-- user is not logged in -->
			<DropdownMenu.Item>
				{#snippet child()}
					<Button
						variant="ghost"
						size="dropdown-link"
						href="/auth/login"
					>
						Login
					</Button>
				{/snippet}
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				{#snippet child()}
					<Button
						variant="ghost"
						size="dropdown-link"
						href="/auth/sign-up"
					>
						Sign Up
					</Button>
				{/snippet}
			</DropdownMenu.Item>
		{:else}
			<DropdownMenu.Label>
				{user.displayName || user.username}
			</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				{#snippet child()}
					<Button variant="ghost" size="dropdown-link" href="/app">
						Dashboard
					</Button>
				{/snippet}
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				{#snippet child()}
					<Button
						variant="ghost"
						size="dropdown-link"
						href="/app/account"
					>
						Account
					</Button>
				{/snippet}
			</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				{#snippet child()}
					<Button
						variant="ghost-destructive"
						size="dropdown-link"
						href="/auth/logout"
					>
						Log Out
					</Button>
				{/snippet}
			</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
