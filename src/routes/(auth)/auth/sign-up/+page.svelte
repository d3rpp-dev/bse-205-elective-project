<script lang="ts">
	import type { ValidOauthMethods } from "$lib/server/auth/oauth_methods";

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

{#if $username_availability_query.isError}
	<pre>{$username_availability_query.error.message}</pre>
{/if}
