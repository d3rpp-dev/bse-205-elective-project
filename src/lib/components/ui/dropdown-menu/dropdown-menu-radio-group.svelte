<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
	import type { RadioGroupProps } from ".";

	let { value = $bindable(), children, ...rest }: RadioGroupProps = $props();
</script>

<DropdownMenuPrimitive.RadioGroup {...rest} bind:value>
	{@render children()}
</DropdownMenuPrimitive.RadioGroup>
