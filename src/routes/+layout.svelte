<script lang="ts">
	import "../app.css";

	import type { Snippet } from "svelte";

	import { ModeWatcher } from "mode-watcher";

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
</script>

<ModeWatcher defaultMode="dark" />

{@render children()}
