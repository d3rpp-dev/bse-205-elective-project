<script lang="ts">
	import type { User } from "lucia";
	import { APPLICATION_NAME, APPLICATION_ICON } from ".";

	import { AccountHeaderComponent } from "@/account";

	interface Props {
		user: User | null;
	}

	const { user }: Props = $props();
</script>

<header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>

	<div class="container mx-auto flex h-24 max-w-screen-2xl items-center px-4" >

		<div class="flex items-center md:mr-4">

			<!-- This is apparently svelte 5, this is cursed -->
			
			
			<img src="src/lib/logos/Logo-Green.svg" alt="JailBird Green" >

			<img src="src/lib/logos/JailBirdText.svg" alt="JailBird">

			<span class="ml-4 h-6 text-lg font-bold sm:inline-block font-futura-demi" >
				{APPLICATION_NAME}
			</span>


		</div>

		<div class="hidden flex-1 items-center justify-between space-x-40 md:flex md:justify-end">

			<AccountHeaderComponent {user} />

			<!-- Menu icons -->
			<!-- Need to add statement that changes the image to the green version when it is on the corresponding page -->
			<div class="flex flex-col items-center">
				<img src="src/lib/menuIcons/homeWhite.svg" alt="Home Icon" style="height: 40px;">
				<p>Home</p>
			</div>

			<div class="flex flex-col items-center">
				<img src="src/lib/menuIcons/uploadWhite.svg" alt="Upload File Icon" style="height: 40px;">
				<p>Upload Files</p>
			</div>
			
			<div class="flex flex-col items-center">
				<img src="src/lib/menuIcons/accountWhite.svg" alt="Account Icon" style="height: 40px;">
				<p>Profile</p>
			</div>

		</div>
	</div>
</header>
