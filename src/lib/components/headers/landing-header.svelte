<script lang="ts">
	import type { User } from "lucia";
	import LogoGreen from "$lib/logos/birdAndTextPink.svg";
	import { AccountHeaderComponent } from "@/account";

	interface Props {
		user: User | null;
	}

	const { user }: Props = $props();
</script>

<header
	class="sticky top-0 z-50 flex h-28 w-full flex-row justify-between bg-gradient-to-b from-[#000013] to-[#000000] shadow-lg"
>
	<div class="w-28">
		<!-- empty -->
	</div>

	<div class="grid w-28 place-items-center">
		<img src={LogoGreen} alt="JailBird Green" class="h-20" />
	</div>

	<div class="flex h-full items-center justify-end px-20 py-4">
		<AccountHeaderComponent {user} avatar_size="custom" />
	</div>
</header>
