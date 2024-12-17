<script lang="ts">
  import Textfield from "@smui/textfield";
  import Icon from "@smui/textfield/icon";
  import type { DateInputConfig } from "$lib/models/form";

  type InputProps = {
    config: DateInputConfig;
    value?: string;
  }
  let {
    config,
    value = ''
  }: InputProps = $props();

  const {
    key,
    label
  } = config;

</script>

<Textfield
  type="date"
  {label}
  id={key}
  input$name={key}
  bind:value
>
  {#snippet leadingIcon()}
    <Icon class="material-icons">
      calendar_month
    </Icon>
  {/snippet}
</Textfield>

<style>

</style>
