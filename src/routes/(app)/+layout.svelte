<script lang="ts">
	import { onMount, setContext } from "svelte";
	import { toStore } from "svelte/store";

	import { page } from "$app/stores";

	import { trpc } from "$lib/trpc/client";

	import { toast } from "svelte-sonner";

	import { Provider as TooltipProvider } from "@/ui/tooltip";

	import UploadFileFAB from "./uploadFileFAB.svelte";

	import { uploadingCount } from "./uploading.svelte";

	const { children } = $props();

	const queryClient = trpc($page);

	let online_state = $state(false);
	const online_store = toStore(() => online_state);
	setContext("online_store", online_store);

	const health_query = queryClient.health.ping.createQuery(
		{ msg: "ping" },
		{
			retry: false,
		},
	);

	let bad_connection_toast: string | number | null = $state(null);

	const registerOnTabCloseEvent = () => {
		window.onbeforeunload = () => {
			if (uploadingCount > 0) {
				return `${uploadingCount} file${uploadingCount > 1 ? "s" : ""} are being encrypted and uploaded, closing the tab will cancel this.`;
			}
		};
	};

	onMount(() => {
		registerOnTabCloseEvent();

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

<TooltipProvider>
	{@render children()}
	<UploadFileFAB />
</TooltipProvider>
