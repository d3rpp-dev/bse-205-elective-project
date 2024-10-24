<script lang="ts">
	import { Avatar as AvatarPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	const {
		class: className,
		src,
		alt,

		...rest
	}: AvatarPrimitive.ImageProps = $props();
</script>

<AvatarPrimitive.Image
	{src}
	{alt}
	class={cn("aspect-square h-full w-full", className)}
	{...rest}
/>
