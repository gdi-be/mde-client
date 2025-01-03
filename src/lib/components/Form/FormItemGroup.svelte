<script lang="ts">
  import type { Snippet } from "svelte";

  type InputProps = {
    label?: string;
    layout?: 'horizontal' | 'vertical';
    children: Snippet;
  }

  let {
    label,
    layout = 'vertical',
    children
  }: InputProps = $props();

</script>

<div class="form-item-group">
  <fieldset class={layout}>
    <legend>{label}</legend>
      {@render children?.()}
  </fieldset>
</div>

<style lang="scss">
  .form-item-group {
    fieldset.horizontal {
      display: flex;
    }
  }
</style>
