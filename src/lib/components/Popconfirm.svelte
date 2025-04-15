<script lang="ts">
  import { closePopconfirm, getPopconfirmState } from '$lib/context/PopConfirmContex.svelte';
  import Button from '@smui/button';
  import Spinner from './Spinner.svelte';

  const { anchorElement, confirmButtonText, open, onConfirm, onCancel, text } =
    $derived(getPopconfirmState());

  let dialog = $state<HTMLDialogElement>();
  let loading = $state(false);

  const anchorRect = $derived(anchorElement?.getBoundingClientRect());

  const confirmButtonHandler = async () => {
    loading = true;
    try {
      await onConfirm();
    } finally {
      loading = false;
      closePopconfirm();
    }
  };
</script>

<dialog
  class="popconfirm"
  bind:this={dialog}
  {open}
  style={`
    top: ${anchorRect?.top}px;
    left: ${anchorRect?.right}px;
  `}
>
  <span class="confirmation-text">
    {text}
  </span>
  <div class="actions">
    <Button variant="unelevated" onclick={confirmButtonHandler} disabled={loading}>
      {confirmButtonText}
      {#if loading}
        <Spinner />
      {/if}
    </Button>
  </div>
</dialog>

{#if open}
  <div
    class="mask"
    onclick={!loading ? onCancel : undefined}
    onkeydown={!loading ? onCancel : undefined}
    role="button"
    tabindex="0"
  ></div>
{/if}

<style lang="scss">
  .popconfirm {
    position: fixed;
    margin: 0;
    z-index: 1000;
    background-color: var(--mdc-theme-surface);
    border: 1px solid var(--mdc-theme-primary);
    transform: translate(5%, -80%);
    border-radius: 8px;
    padding: 0.25em;

    .confirmation-text {
      max-width: 200px;
      text-align: center;
      padding: 0.5em;
      display: block;
    }

    .actions {
      display: flex;
      justify-content: center;

      :global(.spinner) {
        margin-left: 0.5em;
      }
    }
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    z-index: 1;
  }
</style>
