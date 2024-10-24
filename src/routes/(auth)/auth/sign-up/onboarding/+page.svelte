<script lang="ts">
	import { goto } from "$app/navigation";
	import { getRuntimeClientContext } from "$lib/client";
	import Main from "@/main.svelte";
	import { onMount } from "svelte";

	const amalgamation = getRuntimeClientContext();
</script>

<Main class="grid h-app-main place-items-center"></Main>
