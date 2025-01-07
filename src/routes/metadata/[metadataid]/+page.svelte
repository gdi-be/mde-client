<script>
  import { page } from "$app/stores";
  import Form from "$lib/components/Form/Form.svelte";

  const activeSection = $page.url.hash.slice(1);

  let { data } = $props();
  const {
    help,
    metadata
  } = $derived(data);

</script>

<div class="metadata">
  <h1>{ metadata.isoMetadata.title }</h1>
  <Form {metadata} {help} {activeSection} />
</div>

<style lang="scss">
  .metadata {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
