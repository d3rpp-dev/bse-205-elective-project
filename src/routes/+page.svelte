<script>
	import { Button } from "$lib/components/ui/button";

	const aaaa = () => {
		console.error("AAAAAAAA");
	}

</script>

<h1 class="text-3xl font-bold">Welcome to SvelteKit</h1>

<p>
	Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a>
	to read the documentation
</p>

<Button on:click={aaaa} variant="default">Button</Button>
<Button variant="destructive">AAAAAAAA</Button>
