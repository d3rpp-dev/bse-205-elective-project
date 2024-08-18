<script lang="ts">
	import Main from "@/main.svelte";

	import { Button } from "@/ui/button";
	import { Label } from "@/ui/label";
	import { Input } from "@/ui/input";
	import * as Card from "@/ui/card";

	import { PAGE_TRANSITION_TIME } from "$lib";

	import { fade } from "svelte/transition";

	const onsubmit = (ev: SubmitEvent) => {
		ev.preventDefault();
	};
</script>

<Main class="grid h-app-main place-items-center">
	<div transition:fade={{ duration: PAGE_TRANSITION_TIME }}>
		<Card.Root class="w-[350px]">
			<Card.Header>
				<Card.Title>Login</Card.Title>
				<Card.Description>
					Login to your account and supply your secret key.
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<form {onsubmit}>
					<div class="grid w-full items-center gap-4">
						<div class="flex flex-col space-y-1.5">
							<Label for="username">Username</Label>
							<Input id="username" type="text" />
						</div>

						<div class="flex flex-col space-y-1.5">
							<Label for="password">Password</Label>
							<Input id="password" type="password" />
						</div>

						<div class="flex flex-col space-y-1.5">
							<Label for="secret-key">Secret Key</Label>
							<Input
								id="secret-key"
								class="cursor-pointer"
								type="file"
							/>
						</div>

						<div class="flex flex-row items-center gap-4">
							<a
								class="text-sm text-secondary-foreground underline"
								href="/auth/sign-up"
							>
								Sign Up
							</a>
							<span class="flex-1"></span>
							<Button variant="default">Continue</Button>
						</div>
					</div>
				</form>
			</Card.Content>
		</Card.Root>
	</div>
</Main>
