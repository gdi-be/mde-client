<script lang="ts">
  import IconButton from '@smui/icon-button';
  import { Icon } from '@smui/button';
  import { getValue } from '$lib/context/FormContext.svelte';
  import type { FieldKey } from '$lib/models/form';
  import type { FullFieldConfig } from './FieldsConfig';
  import toast from 'svelte-french-toast';

  export type CopyButtonProps = {
    key: FieldKey;
    fieldConfig?: FullFieldConfig;
  };

  let { key, fieldConfig }: CopyButtonProps = $props();

  const value = $derived(getValue(key));
  let copied = $state(false);
  let copyFailed = $state(false);

  const copyValue = async () => {
    try {
      let text = '';

      if (fieldConfig?.getCopyValue) {
        try {
          text = await fieldConfig.getCopyValue(value);
        } catch {
          toast.error('Fehler beim Abrufen des Wertes für die Zwischenablage.');
          return;
        }
      } else if (value) {
        if (typeof value === 'string') {
          text = value;
        } else if (typeof value === 'number') {
          text = value.toString();
        } else if (typeof value === 'boolean') {
          text = value ? 'Ja' : 'Nein';
        } else {
          // Fallback for other types, e.g., objects
          text = JSON.stringify(value);
        }
        // remove quotes from the string if it's a stringified object
        if (text?.startsWith('"') && text?.endsWith('"')) {
          text = text.slice(1, -1);
        }
      }

      await navigator.clipboard.writeText(text);
      copied = true;
      setTimeout(() => (copied = false), 500);
    } catch (error) {
      console.error('Clipboard copy failed', error);
      copyFailed = true;
      setTimeout(() => (copyFailed = false), 500);
    }
  };
</script>

<IconButton title="Wert in Zwischenablage kopieren" type="button" size="button" onclick={copyValue}>
  <div class:pop={copied} class:shake={copyFailed}>
    <Icon class="material-icons">content_copy</Icon>
  </div>
</IconButton>

<style>
  :global(.pop i) {
    animation: pop 0.5s ease-out;
  }

  :global(.shake i) {
    animation: shake 0.5s ease-in-out;
  }

  @keyframes pop {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    20%,
    60% {
      transform: translateX(-5px);
    }
    40%,
    80% {
      transform: translateX(5px);
    }
  }
</style>
