<script lang="ts">
  import Textfield from "@smui/textfield";
  import CharacterCounter from "@smui/textfield/character-counter";
  import type { TextAreaInputConfig } from "$lib/models/form";

  type InputProps = {
    config: TextAreaInputConfig;
    value?: string;
  }
  let {
    config,
    value = ''
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
  input$name={key}
  name={key}
  input$maxlength={maxlength}
  bind:value
>
  {#snippet internalCounter()}
    {#if maxlength}
      <CharacterCounter />
    {/if}
  {/snippet}
</Textfield>

<style>

</style>
