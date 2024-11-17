<script>
	import Main from "@/main.svelte";

	import { page } from "$app/stores";

	import { Button } from "$lib/components/ui/button";
	import { trpc } from "$lib/trpc/client";

	import { toast } from "svelte-sonner";

	const rpc = trpc($page);
	// const greeter = rpc.greeter.greeting.createQuery({name: "Jacksonplusten"});

	const aaaa = () => {
		toast.promise(new Promise((res) => setTimeout(res, 5_000)), {
			loading: "Loading",
			important: true,
			finally: () => {
				toast.success("Done.");
			},
		});
	};
</script>

<!--Home Page Test-->

<Main class="min-h-app-main max-w-screen-lg">
	<div>
		<h1 class="text-3xl font-bold">Folders</h1>
		<div>
			<!-- Div to store each folder / folder button in-->
			<Button variant="folder">Work</Button>
			<Button variant="destructive">Personal</Button>
			<Button variant="destructive">Photos</Button>
			<Button variant="destructive">Bills</Button>
		</div>
	</div>

	<!-- {#if $greeter.isLoading}
	loading
	{:else if $greeter.isError}
	is Error
	{:else}
	{$greeter.data}
	{/if} -->

	<Button onclick={aaaa} variant="default">Button</Button>
	<Button variant="destructive">AAAAAAAA</Button>
</Main>
