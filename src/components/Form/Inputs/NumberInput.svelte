<script lang="ts">
  import Textfield from "@smui/textfield";

  type InputProps = {
    type: 'integer' | 'float',
    key: string,
    label: string,
  }
  let {
    type,
    label,
    key
  }: InputProps = $props();
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
