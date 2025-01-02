<script lang="ts">
  import { page } from "$app/stores";
  import TextInput from "$lib/components/Form/Inputs/TextInput.svelte";
  import Checkmark from "../../Checkmark.svelte";
  import { getValue } from "../FormContext.svelte";

  const KEY = 'isoMetadata.title';

  const initialValue = getValue<string>(KEY);
  let value = $state(initialValue);
  let showCheckmark = $state(false);

  const onBlur = async () => {
    // TODO: initial value does not get updated
    if (value === initialValue) {
      return;
    }
    const response = await fetch($page.url, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        key: KEY,
        value
      })
    });
    showCheckmark = response.ok;
  };

</script>

<div class="title-field">
  <div class="input">
    <TextInput
      bind:value
      key={KEY}
      label="Title"
      maxlength={100}
      onblur={onBlur}
    />
  </div>
  <Checkmark
    bind:running={showCheckmark}
  />
</div>

<style lang="scss">
  .title-field {
    position: relative;
    display: flex;
    align-items: center;

    .input {
      flex: 1;
    }

    :global(.mdc-text-field) {
      display: flex;
    }
  }
</style>
