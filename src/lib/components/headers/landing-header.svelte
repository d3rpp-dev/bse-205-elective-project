<script lang="ts">
	import type { User } from "lucia";
	import { APPLICATION_NAME, APPLICATION_ICON } from ".";
	import { AccountHeaderComponent } from "@/account";
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';

	import LogoGreen from "$lib//logos/Logo-Green.svg"

	interface Props {
		user: User | null;
	}

	const { user }: Props = $props();

	//need to add pathways for each page
	const isHomePage = derived(page, $page => $page.url.pathname === '/');
	const isUploadPage = derived(page, $page => $page.url.pathname === '/');
	const isProfilePage = derived(page, $page => $page.url.pathname === '/src/routes/(app)/app/account/page.svelte');

</script>


<header class="sticky top-0 z-50 w-full border-b border-border/40 bg-[#373737] backdrop-blur supports-[backdrop-filter]:bg-[#373737]"
>

	<div class="container mx-auto flex h-24 max-w-screen-2xl items-center px-4" >

		<div class="flex items-center md:mr-4">
			
			<img src={LogoGreen} alt="JailBird Green" class="h-20">

			<h1 class="">JailBird</h1>


		</div>

		<div class="hidden flex-1 items-center justify-between space-x-40 md:flex md:justify-end">

			<AccountHeaderComponent {user} />

			<!-- Menu icons -->

			<div>
				<a href=""  class="flex flex-col items-center">
					<img src={$isHomePage ? "src/lib/menuIcons/homeGreen.svg" : "src/lib/menuIcons/homeWhite.svg"}
					alt="Home Icon" 
					style="height: 40px;"
					class:active-icon={$isHomePage}>
					
					<p class:active-text={$isHomePage}>Home</p>
				</a>
			</div>


			<div>
				<a href="" class="flex flex-col items-center">
					<img src={$isUploadPage ? "src/lib/menuIcons/uploadGreen.svg" : "src/lib/menuIcons/uploadWhite.svg"} 
					alt="Upload File Icon" 
					style="height: 40px;">

					<p class:active-text={$isUploadPage}>Upload Files</p>
				</a>
			</div>
			

			<div>
				<a href="/src/routes/(app)/app/account"  class="flex flex-col items-center">
					<img src={$isProfilePage ? "src/lib/menuIcons/accountGreen.svg" : "src/lib/menuIcons/accountWhite.svg"} 
					alt="Account Icon" 
					style="height: 40px;">
					
					<p class:active-text={$isProfilePage}>Profile</p>

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
		color: #6CFF96;
	}
</style>
