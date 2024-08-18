<script lang="ts">
	import Main from "@/main.svelte";

	import { Button } from "@/ui/button";
	import { Label } from "@/ui/label";
	import { Input, File } from "@/ui/input";
	import * as Card from "@/ui/card";

	import { PAGE_TRANSITION_TIME } from "$lib";

	import { fade } from "svelte/transition";

	let username = $state("");
	let password = $state("");
	let secret_key_filelist: FileList | undefined = $state(undefined);

	$effect(() => {
		if (secret_key_filelist && secret_key_filelist.item(0)) {
			const blob_url = URL.createObjectURL(secret_key_filelist.item(0)!);
			fetch(blob_url)
				.then((res) => res.json())
				.then(console.log);
		}
	});

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
							<File
								id="secret-key"
								class="cursor-pointer"
								accept="application/json"
								onchange={(ev) => {
									if (
										!(ev.target instanceof HTMLInputElement)
									)
										return;
									if (ev.target.files)
										secret_key_filelist = ev.target.files;
								}}
								ondrop={(ev) => {
									// handle drag and drop.
									ev.stopPropagation();
									ev.preventDefault();

									const dt = ev.dataTransfer;
									if (dt && dt.files)
										secret_key_filelist = dt.files;
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
					</div>
				</form>
			</Card.Content>
		</Card.Root>
	</div>
</Main>
