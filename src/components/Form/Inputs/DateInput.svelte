<script lang="ts">
  import Textfield from "@smui/textfield";
  import Icon from "@smui/textfield/icon";

  type InputProps = {
    key: string,
    label: string
  }

  let {
    key,
    label
  }: InputProps = $props();

  // type InputConfig = {}
  // const config: InputConfig = {};

</script>

<Textfield
  type="date"
  {label}
  id={key}
  name={key}
  value=""
>
  {#snippet leadingIcon()}
    <!-- // TODO: replace with real icon -->
    <Icon>🗓️</Icon>
  {/snippet}
</Textfield>

<style>

</style>
