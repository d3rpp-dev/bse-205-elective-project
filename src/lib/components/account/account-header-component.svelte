<script lang="ts">
	import { User } from "lucide-svelte";

	import * as Avatar from "@/ui/avatar";
	import * as DropdownMenu from "@/ui/dropdown-menu";
	import { goto } from "$app/navigation";
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Avatar.Root>
			<Avatar.Image
				src="https://cdn.d3rpp.dev/haaaaaaaa"
				alt="Profile Photo"
			/>
			<Avatar.Fallback><User /></Avatar.Fallback>
		</Avatar.Root>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => goto("/auth/login")}>
			Login
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => goto("/auth/sign-up")}>
			Sign Up
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
