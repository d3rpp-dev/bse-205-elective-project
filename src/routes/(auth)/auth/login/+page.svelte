<script lang="ts">
	import { trpc } from "$lib/trpc/client";
	import { page } from "$app/stores";

	import Main from "@/main.svelte";

	import { Button } from "@/ui/button";
	import * as Card from "@/ui/card";
	import { Input, File as FileInput } from "@/ui/input";
	import { Label } from "@/ui/label";
	import { Separator } from "@/ui/separator";

	import { GithubLogo } from "svelte-radix";

	import { PAGE_TRANSITION_TIME } from "$lib";

	import { fade, slide } from "svelte/transition";
	import { goto } from "$app/navigation";

	let username = $state("");
	let password = $state("");
	let secret_key_file: File | null = $state(null);

	const rpc = trpc($page);

	const secret_key_json: Promise<unknown> | null = $derived.by(async () => {
		if (secret_key_file) {
			const blob_url = URL.createObjectURL(secret_key_file);
			const blob_response = await fetch(blob_url);
			return (await blob_response.json()) as unknown;
		} else {
			return Promise.resolve(null);
		}
	});

	const log_in_mutation = rpc.auth.logIn.createMutation({
		onSuccess: () => {
			goto("/app");
		},
	});

	/**
	 * On Submit form Handler
	 *
	 */
	const onsubmit = (ev: SubmitEvent) => {
		ev.stopPropagation();
		ev.preventDefault();

		$log_in_mutation.mutate({ username, password });
	};

	/**
	 * Log In with Github Button Handler
	 */
	const githubLoginOnclick = (ev: MouseEvent) => {
		ev.stopPropagation();
		ev.preventDefault();

		goto("/oauth/github");
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
							<Label for="username">
								Username&nbsp;
								<span class="text-destructive-foreground">
									*
								</span>
							</Label>
							<Input
								id="username"
								type="text"
								required={true}
								bind:value={username}
							/>
						</div>

						<div class="flex flex-col space-y-1.5">
							<Label for="password">
								Password&nbsp;
								<span class="text-destructive-foreground">
									*
								</span>
							</Label>
							<Input
								id="password"
								type="password"
								required={true}
								bind:value={password}
							/>
						</div>

						<div class="flex flex-col space-y-1.5">
							<Label for="secret-key">
								Secret Key&nbsp;
								<span class="text-destructive-foreground">
									*
								</span>
							</Label>
							<!-- TODO: make this required -->
							<FileInput
								id="secret-key"
								class="cursor-pointer"
								required={false}
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

						<!-- Errors returned from the server during Login -->

						{#if $log_in_mutation.isError}
							<div
								transition:slide={{ axis: "y" }}
								class="h-auto w-full text-sm text-destructive-foreground transition-height"
							>
								{$log_in_mutation.error.message}
							</div>
						{/if}

						<div class="flex flex-row items-center gap-4">
							<a
								class="text-sm text-secondary-foreground underline"
								href="/auth/sign-up"
							>
								Sign Up
							</a>
							<span class="flex-1"></span>
							<Button variant="default" type="submit">
								Continue
							</Button>
						</div>
					</div>
				</form>

				<div
					class="my-4 flex w-full flex-row items-center justify-center gap-4"
				>
					<Separator class="w-[40%]" orientation="horizontal" />
					<span class="text-sm italic">or</span>
					<Separator class="w-[40%]" orientation="horizontal" />
				</div>

				<Button
					class="flex w-full flex-row justify-start gap-4 hover:bg-white hover:text-[#1f2328]"
					variant="outline"
					onclick={githubLoginOnclick}
				>
					<GithubLogo />
					<span>Log In with GitHub</span>
				</Button>

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
			</Card.Content>
		</Card.Root>
	</div>
</Main>
