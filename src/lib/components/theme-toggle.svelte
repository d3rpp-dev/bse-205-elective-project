<script lang="ts">
	import Sun from "svelte-radix/Sun.svelte";
	import Moon from "svelte-radix/Moon.svelte";
	import Gear from "svelte-radix/Gear.svelte";

	import { resetMode, setMode } from "mode-watcher";
	import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
</script>

<!-- 
	@component

	A component that allows the user to select a theme, 
	**the default set in the root `+layout.svelte` is "dark".**
-->

<DropdownMenu.Root>
	<!-- 
		Theme Button
	-->
	<DropdownMenu.Trigger
		class={buttonVariants({
			variant: "outline",
			size: "icon",
		})}
	>
		<Sun
			class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
		/>
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</DropdownMenu.Trigger>
	<!-- 
		Theme Options
	-->
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => setMode("light")}>
			<Sun size="0.8rem" class="mr-4" /> Light
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => setMode("dark")}>
			<Moon size="0.8rem" class="mr-4" /> Dark
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => resetMode()}>
			<Gear size="0.8rem" class="mr-4" /> System
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
