<script lang="ts">
  import Textfield from "@smui/textfield";
  import type { FormItemConfig } from "../../../lib/models/form";

  type InputProps = {
    config: FormItemConfig;
  }
  let {
    config
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
  id={key}
  name={key}
  value={0}
>
</Textfield>
