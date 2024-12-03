<script lang="ts">
  import Textfield from "@smui/textfield";
  import CharacterCounter from "@smui/textfield/character-counter";
  import type { FormItemConfig } from "../../../lib/models/form";

  type InputProps = {
    config: FormItemConfig;
  }
  let {
    config
  }: InputProps = $props();

  const {
    key,
    label,
    maxlength
  } = config;

</script>

<Textfield
  {label}
  id={key}
  textarea
  name={key}
  input$maxlength={maxlength}
  value=""
>
  {#snippet internalCounter()}
    {#if maxlength}
      <CharacterCounter />
    {/if}
  {/snippet}
</Textfield>

<style>

</style>
