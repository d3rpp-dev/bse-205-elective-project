<script lang="ts">
	import Main from "@/main.svelte";

	import { Button } from "@/ui/button";
	import { Label } from "@/ui/label";
	import { Input, File as FileInput } from "@/ui/input";
	import * as Card from "@/ui/card";

	import { PAGE_TRANSITION_TIME } from "$lib";

	import { fade } from "svelte/transition";

	let username = $state("");
	let password = $state("");
	let secret_key_file: File | null = $state(null);

	const secret_key_json: Promise<any> | null = $derived.by(async () => {
		if (secret_key_file) {
			const blob_url = URL.createObjectURL(secret_key_file);
			const blob_response = await fetch(blob_url);
			return await blob_response.json();
		} else {
			return Promise.resolve(null);
		}
	});

	const onsubmit = (ev: SubmitEvent) => {
		ev.stopPropagation();
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
							<Input
								id="username"
								type="text"
								bind:value={username}
							/>
						</div>

						<div class="flex flex-col space-y-1.5">
							<Label for="password">Password</Label>
							<Input
								id="password"
								type="password"
								bind:value={password}
							/>
						</div>

						<div class="flex flex-col space-y-1.5">
							<Label for="secret-key">Secret Key</Label>
							<FileInput
								id="secret-key"
								class="cursor-pointer"
								accept="application/json"
								onchange={(ev) => {
									if (
										!(ev.target instanceof HTMLInputElement)
									)
										return;
									if (ev.target.files)
										secret_key_file =
											ev.target.files.item(0);
								}}
								ondrop={(ev) => {
									// handle drag and drop.
									ev.stopPropagation();
									ev.preventDefault();

									const dt = ev.dataTransfer;
									if (dt && dt.files)
										secret_key_file = dt.files.item(0);
								}}
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

						{#await secret_key_json}
							<!-- Emptys -->
						{:then json}
							{#if json}
								<div
									class="flex flex-row items-center gap-4 overflow-y-auto"
								>
									<pre>{JSON.stringify(json, null, 2)}</pre>
								</div>
							{/if}
						{/await}
					</div>
				</form>
			</Card.Content>
		</Card.Root>
	</div>
</Main>
