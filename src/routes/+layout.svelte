<script>
  import "../app.css";
</script>

<slot />

<style lang="postcss">
  :global(html, body) {
    background-color: theme(colors.gray.100);
  }
</style>
