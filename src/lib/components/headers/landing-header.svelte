<script lang="ts">
	import type { User } from "lucia";
	import { AccountHeaderComponent } from "@/account";
	import { page } from "$app/stores";
	import { derived } from "svelte/store";

	import LogoGreen from "$lib//logos/Logo-GreenWithText.svg";

	interface Props {
		user: User | null;
	}

	const { user }: Props = $props();

</script>

<header
	class="sticky top-0 z-50 w-full bg-[#202020] shadow-lg"
>
	<div class="items-center justify-center flex flex-row px-20 py-2">
		<img src={LogoGreen} alt="JailBird Green" class="h-28 " />
	</div>

</header>
