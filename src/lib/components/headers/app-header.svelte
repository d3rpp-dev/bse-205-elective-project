<script lang="ts">
	import type { User } from "lucia";
	import { APPLICATION_NAME, APPLICATION_ICON } from ".";

	import { AccountHeaderComponent } from "@/account";

	interface Props {
		user: User | null;
	}

	const { user }: Props = $props();
</script>

<header
	class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div
		class="container mx-auto flex h-14 max-w-screen-2xl items-center px-4 2xl:px-0"
	>
		<div class="flex md:mr-4">
			<!-- This is apparently svelte 5, this is cursed -->
			<APPLICATION_ICON />

			<span class="ml-2 font-bold sm:inline-block">
				{APPLICATION_NAME}
			</span>
		</div>

		<div
			class="hidden flex-1 items-center justify-between space-x-2 md:flex md:justify-end"
		>
			<AccountHeaderComponent {user} avatar_size="smol" />
		</div>
	</div>
</header>
