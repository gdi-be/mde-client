<script lang="ts">
  import Textfield from "@smui/textfield";
  import Icon from "@smui/textfield/icon";
  import type { FormItemConfig } from "../../../lib/models/form";

  type InputProps = {
    config: FormItemConfig;
  }
  let {
    config
  }: InputProps = $props();

  const {
    key,
    label
  } = config;

</script>

<Textfield
  type="date"
  {label}
  id={key}
  name={key}
  value=""
>
  {#snippet leadingIcon()}
    <Icon class="material-icons">
      calendar_month
    </Icon>
  {/snippet}
</Textfield>

<style>

</style>
