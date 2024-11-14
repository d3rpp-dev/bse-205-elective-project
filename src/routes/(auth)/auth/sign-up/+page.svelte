<script lang="ts">
	import type { ValidOauthMethods } from "$lib/server/auth/oauth_methods";

	import { goto } from "$app/navigation";

	import { PAGE_TRANSITION_TIME } from "$lib";

	import { fade } from "svelte/transition";

	import Main from "@/main.svelte";

	import { Button } from "@/ui/button";
	import * as Card from "@/ui/card";
	import { GithubLogo } from "svelte-radix";

	const oauthLoginGenerator =
		(provider: ValidOauthMethods) => (ev: MouseEvent) => {
			ev.stopPropagation();
			ev.preventDefault();

			goto(`/oauth/${provider}`);
		};
</script>

<Main class="grid h-app-main place-items-center">
	<div transition:fade={{ duration: PAGE_TRANSITION_TIME }}>
		<Card.Root class="w-[350px]">
			<Card.Header>
				<Card.Title>Sign Up</Card.Title>
				<Card.Description>
					Set up an account and your secret key
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Button
					class="flex w-full flex-row justify-start gap-4 hover:bg-white hover:text-[#1f2328]"
					variant="outline"
					onclick={oauthLoginGenerator("github")}
				>
					<GithubLogo />
					<span>Sign Up with GitHub</span>
				</Button>
			</Card.Content>
		</Card.Root>
	</div>
</Main>
