<script lang="ts">
  import Textfield from "@smui/textfield";
  import CharacterCounter from "@smui/textfield/character-counter";
  import type { TextInputConfig } from "$lib/models/form";

  type InputProps = {
    config: TextInputConfig;
    value?: string;
  }
  let {
    config,
    value = ''
  }: InputProps = $props();

  const { key, label } = config;

</script>

<Textfield
  {label}
  input$name={key}
  input$maxlength={config.maxlength}
  bind:value
>
  {#snippet helper()}
    {#if config.maxlength}
      <CharacterCounter />
    {/if}
  {/snippet}
</Textfield>

<style>

</style>
