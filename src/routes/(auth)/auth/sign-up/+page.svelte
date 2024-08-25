<script lang="ts">
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";

	import { trpc } from "$lib/trpc/client";
	import { PASSWORD_SCHEMA } from "$lib/trpc/schemas";
	import { debounce } from "$lib/utils";
	import { PAGE_TRANSITION_TIME } from "$lib";

	// renamed because it clashes with the $derived rune?
	// ¯\_(ツ)_/¯
	//
	// Damn you Rich Harris
	import {
		derived as derived_store,
		get,
		writable,
		type Readable,
	} from "svelte/store";
	import { slide, fade } from "svelte/transition";

	import Main from "@/main.svelte";

	import { Button } from "@/ui/button";
	import * as Card from "@/ui/card";
	import { Input } from "@/ui/input";
	import { Label } from "@/ui/label";
	import { Separator } from "@/ui/separator";

	import { AnimatedLoading } from "$lib/icons";

	import { CircleCheck, CircleX } from "lucide-svelte";
	import { GithubLogo } from "svelte-radix";

	const rpc = trpc($page);
	// const utils = rpc.createUtils();

	// #region Username Validation
	const username = writable("");
	const username_is_empty = derived_store(
		username,
		(val) => val.length == 0,
		true,
	);

	const username_availability_query =
		rpc.auth.checkUsernameAvailability.createQuery(
			username,
			derived_store(username_is_empty, (val) => {
				return {
					retry: false,
					enabled: !val,
					placeholderData: { available: true },
				};
			}),
		);

	/**
	 * Error text generated from zod error, error reasons (used in `reason`) are defined
	 * in the server handler for the `username_availability_query`.
	 */
	const username_invalid_error_text: Readable<string | undefined> =
		derived_store(username_availability_query, (val) => {
			if (val.data && val.data.available === false)
				return "Username is Taken";

			if (!val.error) return undefined;
			if (
				!val.error.data?.zodError ||
				val.error.data?.zodError.formErrors.length == 0
			)
				return "Unknown Error";

			const first_form_error = val.error.data.zodError.formErrors[0];
			if (first_form_error) return first_form_error;
		});

	// #endregion

	// #region Password Validation
	let password = $state("");

	const password_validation: string | boolean = $derived.by(() => {
		if (password.length === 0) return false;

		const validity = PASSWORD_SCHEMA.safeParse(password);
		if (validity.success) return true;

		return validity.error.format()._errors[0];
	});
	// #endregion

	const signUpMutation = rpc.auth.signUp.createMutation({
		onSuccess: () => {
			goto("/auth/sign-up/onboarding");
		},
	});

	/**
	 * On Submit form handler
	 */
	const onsubmit = (ev: SubmitEvent) => {
		ev.stopPropagation();
		ev.preventDefault();

		$signUpMutation.mutate({ username: get(username), password });
	};

	/**
	 * Sign Up with Github Button Handler
	 */
	const githubSignupOnclick = (ev: MouseEvent) => {
		ev.stopPropagation();
		ev.preventDefault();

		goto("/oauth/github");
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
				<form {onsubmit}>
					<div class="grid w-full items-center gap-4">
						<!-- #region Username Input 
                        -->
						<div class="flex flex-col space-y-1.5">
							<span class="inline-flex h-4 gap-1">
								<Label for="username">Username</Label>
								<!-- Don't want to show anything if it is empty-->
								{#if !$username_is_empty}
									<!-- Loading spinner while checking things -->
									{#if $username_availability_query.isFetching}
										<AnimatedLoading />
									{:else if $username_availability_query.isError || $username_availability_query.data?.available == false}
										<!-- 
                                            Either: 
                                                A: network error
                                                B: invalid username
                                                C: username taken

                                            Details are in the box below
                                        -->
										<CircleX
											class="h-4 w-4 text-destructive-foreground"
										/>
									{:else}
										<CircleCheck
											class="h-4 w-4 text-green-300"
										/>
									{/if}
								{/if}
							</span>

							<Input
								id="username"
								oninput={debounce((ev) => {
									ev.preventDefault();
									if (
										!(ev.target instanceof HTMLInputElement)
									)
										return;
									username.set(ev.target.value);
								}, 500)}
							/>

							{#if ($username_invalid_error_text && !$username_is_empty && !$username_availability_query.isFetching) || $signUpMutation.isError}
								<p
									class="h-auto w-full text-sm text-destructive-foreground transition-height"
									transition:slide={{ axis: "y" }}
								>
									{$signUpMutation.error?.message ||
										$username_invalid_error_text ||
										""}
								</p>
							{/if}
						</div>
						<!-- #endregion -->

						<!-- #region Password Input 
                        -->
						<div class="flex flex-col space-y-1.5">
							<span class="inline-flex h-4 gap-1">
								<Label for="password">Password</Label>
								{#if typeof password_validation === "string"}
									<CircleX
										class="h-4 w-4 text-destructive-foreground"
									/>
								{:else if password_validation === true}
									<CircleCheck
										class="h-4 w-4 text-green-300"
									/>
								{/if}
							</span>
							<Input
								type="password"
								id="password"
								bind:value={password}
							/>
							{#if typeof password_validation === "string"}
								<p
									class="h-8 text-sm text-destructive-foreground transition-height"
									transition:slide={{ axis: "y" }}
								>
									{password_validation}
								</p>
							{/if}
						</div>
						<!-- #endregion -->

						<div class="flex flex-row items-center gap-4">
							<a
								class="text-sm text-secondary-foreground underline"
								href="/auth/login"
							>
								Login
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
					onclick={githubSignupOnclick}
				>
					<GithubLogo />
					<span>Sign Up with GitHub</span>
				</Button>
			</Card.Content>
		</Card.Root>
	</div>
</Main>

{#if $username_availability_query.isError}
	<pre>{$username_availability_query.error.message}</pre>
{/if}
