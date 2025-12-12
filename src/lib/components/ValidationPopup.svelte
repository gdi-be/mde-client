<script lang="ts">
  import { fade } from 'svelte/transition';
  import { sseContext } from '$lib/context/ServerEventContext.svelte';

  const duration = 5000;

  let isVisible = $state(false);
  let metadataId = $state<string | null | undefined>(null);

  const { validation } = $derived(sseContext.getSseContext());

  $effect(() => {
    const lastItem = validation
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .at(-1);

    isVisible = lastItem?.status === 'FINISHED';
    metadataId = lastItem?.metadataId;
  });

  $effect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        isVisible = false;
        metadataId = null;
      }, duration);

      return () => clearTimeout(timeout);
    }
  });
</script>

{#if isVisible}
  <div transition:fade class="popup">
    Validierung abgeschlossen für <a href="/metadata/{metadataId}/readonly">{metadataId}</a>
    <button
      onclick={() => (isVisible = false)}
      style="margin-left: 1rem; background: none; border: none; color: #fff; cursor: pointer;"
      type="button"
    >
      ✖
    </button>
  </div>
{/if}

<style lang="scss">
  .popup {
    position: fixed;
    top: 1rem;
    right: 1rem;
    background-color: #333;
    color: #fff;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  }
</style>
