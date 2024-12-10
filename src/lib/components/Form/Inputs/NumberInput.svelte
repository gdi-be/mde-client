<script lang="ts">
  import Textfield from "@smui/textfield";
  import type { FloatInputConfig, IntegerInputConfig } from "$lib/models/form";

  type InputProps = {
    config: IntegerInputConfig | FloatInputConfig;
    value?: number;
  }
  let {
    config,
    value = 0
  }: InputProps = $props();

  const {
    type,
    key,
    label
  } = config;
</script>

<Textfield
  type="number"
  {label}
  input$step={type === 'float' ? '0.1' : undefined}
  input$name={key}
  name={key}
  bind:value
>
</Textfield>
