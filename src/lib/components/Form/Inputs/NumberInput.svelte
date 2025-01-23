<script lang="ts">
  import Textfield from "@smui/textfield";
  import type { ComponentProps } from "svelte";

  type InputProps = {
    value?: number;
    key?: string;
    label?: string;
    type?: 'float' | 'integer';
  } & ComponentProps<typeof Textfield>;

  let {
    value = $bindable(0),
    key,
    label,
    type = 'integer',
    ...restProps
  }: InputProps = $props();

</script>

<Textfield
  input$step={type === 'float' ? '0.1' : undefined}
  input$name={key}
  {...restProps}
  type="number"
  {label}
  bind:value
>
</Textfield>
