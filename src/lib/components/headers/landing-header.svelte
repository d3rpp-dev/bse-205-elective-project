<script lang="ts">
	import type { User } from "lucia";
	import LogoGreen from "$lib/logos/Logo-GreenWithText.svg";
	import { AccountHeaderComponent } from "@/account";

	interface Props {
		user: User | null;
	}

	const { user }: Props = $props();
</script>

<header
	class="sticky top-0 z-50 w-full shadow-lg h-28 bg-gradient-to-b from-[#202020] to-[#020202]"
>
	<div class="flex items-center justify-end px-20 py-4 h-full">
		<AccountHeaderComponent {user} avatar_size="custom" />
	</div>

	<div class="absolute inset-0 flex items-center justify-center">
		<img src={LogoGreen} alt="JailBird Green" class="h-20" />
	</div>

</header>
