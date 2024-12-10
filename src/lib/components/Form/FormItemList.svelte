<script lang="ts">
  import {
    type FormItemConfig,
    type FormListConfig
  } from "$lib/models/form";
  import IconButton from "@smui/icon-button";
  import FormItem from "./FormItem.svelte";

  type InputProps = {
    config: FormListConfig;
  }
  let {
    config
  }: InputProps = $props();

  let items = $state<FormItemConfig[]>([]);

  const addItem = () => {
    const id = Date.now().toString(36);
    items.push({
      ...config.item,
      listId: `${config.key}[${id}]`
    } as FormItemConfig);
  };

  const removeItem = (listId: FormItemConfig['listId']) => {
    items = items.filter(item => item.listId !== listId);
  };

</script>

<div class="form-item-list">
  <span>
    {config.label}
  </span>
  <IconButton
    class="material-icons"
    onclick={() => addItem()}
    size="button"
  >
    add
  </IconButton>
  {#each items as item (item.listId)}
    <div class="form-item-list-item">
      <FormItem config={item} />
      <IconButton
        class="material-icons"
        onclick={() => removeItem(item.listId)}
        size="button"
      >
        delete
      </IconButton>
    </div>
  {/each}
</div>

<style lang="scss">
  .form-item-list {
    display: flex;
    flex-direction: column;
  }

  .form-item-list-item {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

</style>
