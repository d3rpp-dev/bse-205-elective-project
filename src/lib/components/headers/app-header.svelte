<script lang="ts">
	import type { User } from "lucia";
	import { AccountHeaderComponent } from "@/account";
	import { page } from "$app/stores";
	import { derived } from "svelte/store";

	interface Props {
		user: User | null;
	}

	const { user }: Props = $props();

	//need to add pathways for each page
	const isHomePage = derived(page, ($page) => $page.url.pathname === "/");
	const isUploadPage = derived(page, ($page) => $page.url.pathname === "/");
	const isProfilePage = derived(
		page,
		($page) =>
			$page.url.pathname === "/app/account",
	);
</script>

<header
	class="sticky top-0 z-50 w-full bg-gradient-to-b from-[#202020] to-[#020202]"
>
	<div
		class="container mx-auto flex h-24 max-w-screen-2xl items-center px-4 2xl:px-0"
	>
		<!-- need to add link -->
		<a href="/">
			<div class="flex items-center md:mr-4">
				<img
					src="src/lib/logos/Logo-Green.svg"
					alt="JailBird Green"
					class="h-16"
				/>

				<img 
				src="src/lib/logos/JailBirdText.svg"
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
				<a
					href="/"
					class="group flex flex-col items-center hover:text-[#6CFF96]"
				>
					<img
						src={$isHomePage
							? "src/lib/menuIcons/homeGreen.svg"
							: "src/lib/menuIcons/homeWhite.svg"}
						alt="Home Icon"
						style="height: 40px;"
						class="group-hover:hidden"
					/>
					<img
						src="src/lib/menuIcons/homeGreen.svg"
						alt="Home Icon Hover"
						style="height: 40px;"
						class="hidden group-hover:block"
					/>

					<p
						class="text-white-600 group-hover:text-[#6CFF96]"
						style="font-family: futura, sans-serif; font-weight: 600; font-style: normal; font-size: 1.25rem;"
						class:active-text={$isHomePage}
					>
						Home
					</p>
				</a>
			</div>

			<div>
				<!-- need to add link -->
				<a
					href="/"
					class="group flex flex-col items-center hover:text-[#6CFF96]"
				>
					<img
						src={$isUploadPage
							? "src/lib/menuIcons/uploadGreen.svg"
							: "src/lib/menuIcons/uploadWhite.svg"}
						alt="Upload File Icon"
						style="height: 40px;"
						class="group-hover:hidden"
					/>

					<img
						src="src/lib/menuIcons/uploadGreen.svg"
						alt="Home Icon Hover"
						style="height: 40px;"
						class="hidden group-hover:block"
					/>

					<p
						class="text-white-600 group-hover:text-[#6CFF96]"
						style="font-family: futura, sans-serif; font-weight: 600; font-style: normal; font-size: 1.25rem;"
						class:active-text={$isUploadPage}
					>
						Shared Files
					</p>
				</a>
			</div>

			<div>
				<!-- need to add link -->
				<a
					href="/"
					class="group flex flex-col items-center hover:text-[#6CFF96]"
				>
					<AccountHeaderComponent {user} avatar_size="custom" />

					<p
						class="text-white-600 group-hover:text-[#6CFF96]"
						style="font-family: futura, sans-serif; font-weight: 600; font-style: normal; font-size: 1.25rem;"
						class:active-text={$isProfilePage}
					>
						Profile
					</p>
				</a>
			</div>
		</div>
	</div>
</header>

<style>
	p {
		color: white;
	}

	.active-text {
		color: #6cff96;
	}
</style>
