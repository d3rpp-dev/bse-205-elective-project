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
	class="sticky top-0 z-50 h-28 w-full bg-gradient-to-b from-[#000013] to-[#000000] shadow-lg"
>
	<div class="flex h-full items-center justify-end px-20 py-4">
		<AccountHeaderComponent {user} avatar_size="custom" />
	</div>

	<div class="absolute inset-0 flex items-center justify-center">
		<img src={LogoGreen} alt="JailBird Green" class="h-20" />
	</div>
</header>
