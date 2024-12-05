<script lang="ts">
  import Textfield from "@smui/textfield";
  import CharacterCounter from "@smui/textfield/character-counter";
  import type { TextInputConfig } from "$lib/models/form";

  type InputProps = {
    config: TextInputConfig;
  }
  let {
    config
  }: InputProps = $props();

  const { key, label } = config;

</script>

<Textfield
  {label}
  input$name={key}
  input$maxlength={config.maxlength}
  value=""
>
  {#snippet helper()}
    {#if config.maxlength}
      <CharacterCounter />
    {/if}
  {/snippet}
</Textfield>

<style>

</style>
