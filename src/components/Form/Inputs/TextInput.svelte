<script lang="ts">
  import Textfield from "@smui/textfield";
  import CharacterCounter from "@smui/textfield/character-counter";

  type InputProps = {
    key: string,
    label: string
  }
  type InputConfig = {
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern
    pattern?: string,
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/required
    required?: boolean,
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title
    title?: string,
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/maxlength
    maxlength?: number
  }

  let {
    key,
    label
  }: InputProps = $props();

  const config: InputConfig = {
    // maxlength: 18
  };

</script>

<Textfield
  {label}
  id={key}
  name={key}
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
