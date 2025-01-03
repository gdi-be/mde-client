<script lang="ts">
  import Textfield from "@smui/textfield";
  import CharacterCounter from "@smui/textfield/character-counter";
  import type { ComponentProps } from "svelte";

  type InputProps = {
    key: string;
    label: string;
    maxlength?: number;
    value?: string;
  } & ComponentProps<typeof Textfield>;

  let {
    key,
    label,
    maxlength,
    value = $bindable(""),
    ...restProps
  }: InputProps = $props();

</script>

<div class="text-area-input">
  <Textfield
    textarea
    {label}
    input$name={key}
    input$maxlength={maxlength}
    bind:value
    {...restProps}
  >
    {#snippet helper()}
      {#if maxlength}
        <CharacterCounter />
      {/if}
    {/snippet}
  </Textfield>
</div>
