<svelte:options runes={true} />

<script lang="ts">
	import Main from "@/main.svelte";
	import * as Card from "@/ui/card";
</script>

<Main class="min-h-landing-main max-w-screen-md py-12">
	<Card.Root>
		<Card.Header>
			<Card.Title>Privacy Policy</Card.Title>
		</Card.Header>

		<Card.Content class="flex flex-col gap-4">
			<p>
				Jailbird is a privacy focussed application, this means that if
				we don't need to store information, we won't.
			</p>

			<p>Below is a list of what information we store and why</p>

			<hr class="my-4" />

			<strong>User Information</strong>

			<p>
				We store this information about you as the user to provide our
				services, this includes:
			</p>

			<ul class="flex list-outside list-disc flex-col gap-2 pl-8">
				<li>Username</li>
				<li>GitHub Profile Name</li>
				<li>GitHub User ID</li>
				<li>GitHub Profile Picture</li>
			</ul>

			<p>
				We store this information to display on the user account page,
				there is no other reason to keep this information other than
				that page.
			</p>

			<strong>User Data</strong>

			<p>
				We store user data, this is the primary function of the
				application, the exact user data we store is listed below:
			</p>

			<ul class="flex list-outside list-disc flex-col gap-2 pl-8">
				<li>Public Keys</li>
				<li>Cryptographically Wrapped File Encryption Keys</li>
				<li>Encrypted Files as uploaded by the user</li>
			</ul>

			<p>
				Public keys are uploaded in order to enable future sharing
				functionality, allowing another user to share a file with you.
				The associated <em>private keys</em>
				are not uploaded, ever, meaning we are unable to decrypt your files.
			</p>

			<hr class="my-4" />

			<strong>Requesting Deletion of My Information and Data</strong>

			<p>
				In compliance with EU GDPR and the New Zealand Privacy Act 2020,
				you may contact us requesting deletion of you account and all
				associated data, at which point we will have 15 days to action
				this request.
			</p>

            <p>If you would like to go through with account deletion please email us at <a href="mailto:jailbird@d3rpp.dev" class="hover:underline opacity-80">jailbird@d3rpp.dev</a></p>
		</Card.Content>
	</Card.Root>
</Main>

<style>
	/* fine */

	li {
		padding-left: 0.5rem;
	}
</style>
