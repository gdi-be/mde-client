<script lang="ts">
  import Textfield from "@smui/textfield";
  import Icon from "@smui/textfield/icon";
  import type { ComponentProps } from "svelte";

  type InputProps = {
    value?: string;
    key?: string;
    label?: string;
  } & ComponentProps<typeof Textfield>;

  let {
    key,
    label,
    value = $bindable(''),
    ...restProps
  }: InputProps = $props();

</script>

<Textfield
  type="date"
  {label}
  id={key}
  input$name={key}
  bind:value
  {...restProps}
>
  {#snippet leadingIcon()}
    <Icon class="material-icons">
      calendar_month
    </Icon>
  {/snippet}
</Textfield>

<style>

</style>
