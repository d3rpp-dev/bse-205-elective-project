<script lang="ts">
	import type { Readable } from "svelte/store";
	import { type UploadingState } from "./uploading.svelte";

	const {
		store,
		closeStore,
	}: {
		store: Readable<UploadingState>;
		closeStore: () => void;
	} = $props();
</script>
