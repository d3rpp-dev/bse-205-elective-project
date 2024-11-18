<script lang="ts">
	import type { User } from "lucia";
	import { AccountHeaderComponent } from "@/account";

	import Main from "@/main.svelte";

	interface Props {
		user: User | null;
	}

	const { user }: Props = $props();
</script>

<Main>
	<div class="flex w-full items-center justify-between gap-x-24 pt-32">
		<h1
			class="flex-1 text-left"
			style="font-family: futura, sans-serif; font-weight: 400; font-style: normal; font-size: 4.75rem; text-align: left; color: white; text-shadow: -4px 5px 7px rgba(0, 0, 0, 0.4);"
		>
			<span style="font-weight: 600; color: #6CFF96;">Newest</span>
			and Most
			<br />
			<span style="font-weight: 600; color: #6CFF96;">Secure</span>
			File
			<br />
			<span style="font-weight: 600; color: #6CFF96;">Storage</span>
			 Application.
		</h1>

		<div class="flex flex-1 items-center justify-end">
			<AccountHeaderComponent {user} avatar_size="custom" />
		</div>
	</div>
</Main>
