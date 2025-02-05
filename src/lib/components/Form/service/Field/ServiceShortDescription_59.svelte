<script lang="ts">
  import type { Service } from "$lib/models/metadata";
  import Paper from "@smui/paper";
  import TextAreaInput from "../../Inputs/TextAreaInput.svelte";

  export type ServiceTypeProps = {
    value: Service["shortDescription"],
    onChange: (newValue: string) => void
  };

  let {
    value,
    onChange
  }: ServiceTypeProps = $props();

</script>

<TextAreaInput
  label="Kurzbeschreibung"
  key="shortDescription"
  {value}
  maxlength={500}
  onchange={(e: Event) => onChange((e.target as HTMLInputElement).value)}
/>
