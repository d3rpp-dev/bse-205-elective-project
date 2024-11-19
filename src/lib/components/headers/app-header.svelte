<script lang="ts">
	import type { User } from "lucia";
	import { AccountHeaderComponent } from "@/account";

	interface Props {
		user: User | null;
	}

	const { user }: Props = $props();
</script>

<header
	class="sticky top-0 z-50 w-full bg-gradient-to-b from-[#000013] to-[#000000]"
>
	<!-- Div that contains the icon and text logos -->

	<div
		class="container mx-auto flex h-24 max-w-screen-2xl items-center px-4 2xl:px-0"
	>
		<!-- need to add link -->
		<a href="/app">
			<div class="flex items-center md:mr-4">
				<img
					src="src/lib/logos/BirdPink.svg"
					alt="JailBird Green"
					class="h-16"
				/>

				<img
					src="src/lib/logos/JailBirdTextWhite.svg"
					alt=""
					class="h-16 pl-4"
				/>
			</div>
		</a>

		<div
			class="hidden flex-1 items-center justify-between space-x-20 md:flex md:justify-end"
		>
			<div>
				<!-- need to add link -->
				<a href="/app" class="group flex flex-col items-center">
					<img
						src="src/lib/menuIcons/newHome.svg"
						alt="Home Icon"
						style="height: 40px;"
						class="group-hover:hidden"
					/>
					<img
						src="src/lib/menuIcons/newHomePink.svg"
						alt="Home Icon Hover"
						style="height: 40px;"
						class="hidden group-hover:block"
					/>
				</a>
			</div>

			<div>
				<AccountHeaderComponent {user} avatar_size="custom" />
			</div>
		</div>
	</div>
</header>
