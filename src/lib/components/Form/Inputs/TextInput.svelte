<script lang="ts">
  import Textfield from "@smui/textfield";
  import CharacterCounter from "@smui/textfield/character-counter";
  import type { ComponentProps } from "svelte";

  type InputProps = {
    key?: string;
    label: string;
    maxlength?: number;
    value?: string;
    wrapperClass?: string;
  } & ComponentProps<typeof Textfield>;

  let {
    key,
    label,
    maxlength,
    value = $bindable(""),
    wrapperClass,
    ...restProps
  }: InputProps = $props();

</script>

<div class={['text-input', wrapperClass]} >
  <Textfield
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
