<script lang="ts">
  import Checkmark from './Checkmark.svelte';
  import HelpButton from './HelpButton.svelte';
  import CopyButton from './CopyButton.svelte';
  import { type Snippet } from 'svelte';
  import { Icon } from '@smui/button';
  import { getFormContext, getValue, persistValue } from '$lib/context/FormContext.svelte';
  import IconButton from '@smui/icon-button';
  import { toast } from 'svelte-french-toast';
  import { getPopconfirm } from '$lib/context/PopConfirmContext.svelte';
  import type { FieldKey } from '$lib/models/form';
  import type { FullFieldConfig } from './FieldsConfig';
  import { page } from '$app/state';
  export type FieldToolsProps = {
    value?: unknown;
    key: FieldKey;
    children?: Snippet;
    checkMarkAnmiationRunning?: boolean;
    fieldConfig?: FullFieldConfig;
    noCheckmark?: boolean;
    noHelpButton?: boolean;
    noCopyButton?: boolean;
  };

  let {
    key,
    children,
    checkMarkAnmiationRunning: running = $bindable<boolean>(false),
    fieldConfig,
    noCheckmark = false,
    noHelpButton = false,
    noCopyButton = false,
    value
  }: FieldToolsProps = $props();

  const t = $derived(page.data.t);
  const metadata = $derived(getFormContext()?.metadata);

  const popconfirm = $derived(getPopconfirm());

  const checkIfHasHelp = async () => {
    const response = await fetch(`/help/${key}`);
    if (!response.ok || response.status === 204) return false;
    return true;
  };

  const getValueFromOriginal = async () => {
    const response = await fetch(`/metadata/${metadata?.clonedFromId}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      toast.error(t('fieldtools.fetchOriginalError'));
      return null;
    }

    const originalMetadata = await response.json();
    return getValue(key, originalMetadata);
  };

  const copyFromOriginal = async (k: string, valueFromOriginal: unknown, evt: MouseEvent) => {
    if (valueFromOriginal) {
      const targetEl = evt.currentTarget as HTMLElement;
      evt.preventDefault();
      popconfirm.open(
        targetEl,
        async () => {
          await persistValue(k, valueFromOriginal);
        },
        {
          text: t('fieldtools.copyConfirm'),
          confirmButtonText: t('fieldtools.copy')
        }
      );
    } else {
      toast.error(t('fieldtools.copyError'));
    }
  };
</script>

<div class="field-tools">
  {#await checkIfHasHelp()}
    <!-- Don't render anything to avoid flickering -->
  {:then hasHelp}
    {#if !noHelpButton && hasHelp}
      <HelpButton {key} />
    {/if}
  {:catch}
    <Icon class="material-icons" title={t('fieldtools.helpError')}>warning</Icon>
  {/await}
  {#if !noCopyButton}
    <CopyButton {value} {key} {fieldConfig} />
  {/if}
  {#if metadata?.clonedFromId}
    {#await getValueFromOriginal()}
      <Icon class="material-icons spinner" title={t('fieldtools.checkingOriginal')}>
        progress_activity
      </Icon>
    {:then valueFromOriginal}
      {#if valueFromOriginal}
        <IconButton
          type="button"
          size="button"
          title={t('fieldtools.copyFromOriginal')}
          onclick={(evt) => copyFromOriginal(key, valueFromOriginal, evt)}
        >
          <Icon class="material-icons">settings_backup_restore</Icon>
        </IconButton>
      {/if}
    {:catch}
      <Icon class="material-icons" title={t('fieldtools.originalError')}>warning</Icon>
    {/await}
  {/if}
  {@render children?.()}
  {#if !noCheckmark}
    <Checkmark bind:running />
  {/if}
</div>

<style lang="scss">
  .field-tools {
    position: relative;
    padding: 0.25em 0;
    width: 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f8f9fa;
    outline: 1px solid #e9ecef;
    border-radius: var(--mdc-shape-medium, 4px);

    @keyframes spinning {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    :global(.spinner) {
      padding: 10px;
      margin: 0;
      animation: spinning 1s linear infinite;
    }

    :global(.checkmark) {
      margin: 10px 0;
    }
  }
</style>
