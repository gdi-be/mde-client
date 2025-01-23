<script lang="ts">
  import { onMount, type Snippet } from "svelte";

  export type ScrollableProps = {
    scrollStep?: number;
    children: Snippet;
  };

  const {
    scrollStep = 100,
    children
  }: ScrollableProps = $props();

  let scrollableElement: HTMLDivElement;
  let showButtons = $state(false);

  function updateButtonVisibility() {
    showButtons = scrollableElement.scrollWidth > scrollableElement.clientWidth;
  }

  function scroll(direction: 'left' | 'right') {
    const amount = direction === 'left' ? -scrollStep : scrollStep;
    scrollableElement.scrollBy({ left: amount, behavior: 'smooth' });
  }

  onMount(() => {
    updateButtonVisibility();
    const resizeObserver = new ResizeObserver(updateButtonVisibility);
    resizeObserver.observe(scrollableElement);
    return () => resizeObserver.disconnect();
  });
</script>

<div class="scrollable-container">
  {#if showButtons}
    <button class="scroll-btn left" onclick={() => scroll('left')}>&lt;</button>
  {/if}
  <div bind:this={scrollableElement} class="scrollable">
    {#if children}
      {@render children()}
    {:else}
      <p>You should add children to your &lt;Scrollable /&gt;</p>
    {/if}
  </div>
  {#if showButtons}
    <button class="scroll-btn right" onclick={() => scroll('right')}>&gt;</button>
  {/if}
</div>

<style lang="scss">
  .scrollable-container {
    display: flex;
    align-items: center;
    overflow: hidden;
    width: 100%;

    .scrollable {
      overflow-x: hidden;
      scroll-behavior: smooth;
    }

    .scroll-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      user-select: none;

      &:hover {
        color: var(--mdc-theme-primary);
      }
    }
  }

</style>
