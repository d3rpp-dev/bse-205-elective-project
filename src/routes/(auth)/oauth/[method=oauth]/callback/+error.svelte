<script lang="ts">
	import { page } from "$app/stores";
	let error = $page.error;
</script>

{#if error}
	{error.message}
{/if}
