<script lang="ts">
	import type { PageServerData } from "./$types";
	import type { ValidOauthMethods } from "$lib/server/auth/oauth_methods";

	import { goto } from "$app/navigation";

	import Main from "@/main.svelte";
	import { Button } from "@/ui/button";

	import { ArrowRight } from "lucide-svelte";
	import { GithubLogo } from "svelte-radix";

	const { data }: { data: PageServerData } = $props();

	const { is_signed_in } = data;

	const oauthLoginGenerator =
		(provider: ValidOauthMethods) => (ev: MouseEvent) => {
			ev.stopPropagation();
			ev.preventDefault();

			goto(`/oauth/${provider}`);
		};

	const gotoApp = (ev: MouseEvent) => {
		ev.stopPropagation();
		ev.preventDefault();

		goto(`/app`);
	};
</script>

<Main>
	<div class="flex w-full items-center justify-between gap-x-24 pt-32">
		<h1
			class="flex-1 text-left"
			style="font-family: futura, sans-serif; font-weight: 400; font-style: normal; font-size: 4.75rem; text-align: left; color: white; text-shadow: -4px 5px 7px rgba(0, 0, 0, 0.2);"
		>
			<span style="font-weight: 600; color: #993467;">Newest</span>
			and Most
			<br />
			<span style="font-weight: 600; color: #993467;">Secure</span>
			File
			<br />
			<span style="font-weight: 600; color: #993467;">Storage</span>
			Application.
		</h1>

		<div class="flex flex-1 items-center justify-center">
			{#if is_signed_in}
				<Button
					class="flex w-36 flex-row justify-start gap-4"
					variant="default"
					onclick={gotoApp}
				>
					<span>Go to App</span>
					<ArrowRight />
				</Button>
			{:else}
				<Button
					class="flex w-72 flex-row justify-start gap-4 hover:bg-white hover:text-[#1f2328]"
					variant="outline"
					onclick={oauthLoginGenerator("github")}
				>
					<GithubLogo />
					<span>Log In with GitHub</span>
				</Button>
			{/if}
		</div>
	</div>
</Main>
