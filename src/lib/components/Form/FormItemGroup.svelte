<script lang="ts">
  import type { FormGroupConfig } from "$lib/models/form";
  import FormItem from "./FormItem.svelte";

  type InputProps = {
    config: FormGroupConfig;
  }
  let {
    config
  }: InputProps = $props();

</script>

<div class="form-item-group">
  <fieldset class={config.layout}>
    <legend>{config.label}</legend>
    {#each config.items as item}
      <FormItem config={item} />
    {/each}
  </fieldset>
</div>

<style lang="scss">
  .form-item-group {
    fieldset.horizontal {
      display: flex;
    }
  }
</style>
