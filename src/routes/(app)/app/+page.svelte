<script>
	import Main from "@/main.svelte";

	import { Button } from "$lib/components/ui/button";

    import { toast } from "svelte-sonner";

	const aaaa = () => {
        toast.promise(new Promise(res => setTimeout(res, 5_000)), {
            loading: "Loading",
            important: true,
            finally: () => {
                toast.success("Done.")
            }
        });

	};
</script>

<Main class="min-h-app-main max-w-screen-lg">
	<h1 class="text-3xl font-bold">Welcome to SvelteKit</h1>

	<p>
		Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a>
		to read the documentation
	</p>

	<Button onclick={aaaa} variant="default">Button</Button>
	<Button variant="destructive">AAAAAAAA</Button>
</Main>
