<script lang="ts">
	import { onMount, setContext } from "svelte";
	import { toStore } from "svelte/store";

	import { page } from "$app/stores";

	import { setRuntimeClientContext, TheAmalgamation } from "$lib/client";
	import { trpc } from "$lib/trpc/client";

	import { toast } from "svelte-sonner";

	const { children } = $props();

	const queryClient = trpc($page);
	const amalgamation = new TheAmalgamation();
	setRuntimeClientContext(amalgamation);

	let online_state = $state(true);
	const online_store = toStore(() => online_state);
	setContext("online_store", online_store);

	const health_query = queryClient.health.ping.createQuery(
		{ msg: "ping" },
		{
			retry: false,
		},
	);

	let bad_connection_toast: string | number | null = $state(null);

	onMount(() => {
		health_query.subscribe((state) => {
			if (state.isError || state.isRefetchError) {
				if (bad_connection_toast === null) {
					bad_connection_toast = toast.error("Connection Lost", {
						description:
							"Your device is unable to contact our server, or our server is down.",
						dismissable: false,
						important: true,
						delete: false,
						duration: 99999999999,
						invert: true,
					});
				}
			} else if (state.isSuccess && bad_connection_toast !== null) {
				toast.dismiss(bad_connection_toast);
				bad_connection_toast = null;
			}
		});

		setInterval(() => {
			$health_query.refetch();
		}, 5_000);
	});
</script>

{@render children()}
