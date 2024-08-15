<script lang="ts" generics="T, E">
    import type { CreateQueryResult } from '@tanstack/svelte-query';
    import type { Snippet } from "svelte";

    interface Props {
        query: CreateQueryResult<T, E>,

        onpending?: Snippet,
        onerror?: Snippet<[E]>,
        ondone: Snippet<[T | undefined, boolean]>
    };

    const {
        query,

        onpending,
        onerror,
        ondone
    }: Props = $props();
</script>

{#if $query.isPending && onpending}
    {@render onpending()}
{:else if $query.isError && onerror}
    {@render onerror($query.error)}
{:else}
    {@render ondone($query.data, $query.isPlaceholderData)}
{/if}