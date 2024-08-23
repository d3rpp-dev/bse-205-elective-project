<script lang="ts">
	import { User } from "lucide-svelte";

	import * as Avatar from "@/ui/avatar";
	import * as DropdownMenu from "@/ui/dropdown-menu";

	import type { User as UserType } from "lucia";

	interface Props {
		user: UserType | null;
	}

	const { user = null }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Avatar.Root>
			{#if user && user.profile_picture}
				<Avatar.Image
					src={`/api/public_assets/${user.profile_picture}`}
					alt="Profile Photo"
				/>
			{/if}
			<Avatar.Fallback><User /></Avatar.Fallback>
		</Avatar.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-[350px]">
		{#if user === null}
			<!-- user is not logged in -->
			<DropdownMenu.Item href="/auth/login">Login</DropdownMenu.Item>
			<DropdownMenu.Item href="/auth/sign-up">Sign Up</DropdownMenu.Item>
		{:else}
			<DropdownMenu.Label>
				{user.display_name || user.username}
			</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Item href="/app">Dashboard</DropdownMenu.Item>
			<DropdownMenu.Item>Account</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item href="/auth/logout" variant="destructive">
				Log Out
			</DropdownMenu.Item>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
