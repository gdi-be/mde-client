<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements';

  let { ...others }: SvelteHTMLElements['div'] = $props();
</script>

<div class="spinner" role="status" aria-label="Loading" {...others}>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>

<style lang="scss">
  .spinner {
    display: inline-block;
    position: relative;
    width: 20px;
    height: 20px;

    div {
      box-sizing: border-box;
      display: block;
      position: absolute;
      width: 16px;
      height: 16px;
      margin: 2px;
      border: 2px solid currentColor;
      border-radius: 50%;
      animation: spinner-animation 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      border-color: currentColor transparent transparent transparent;

      &:nth-child(1) {
        animation-delay: -0.45s;
      }

      &:nth-child(2) {
        animation-delay: -0.3s;
      }

      &:nth-child(3) {
        animation-delay: -0.15s;
      }
    }
  }

  @keyframes spinner-animation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
