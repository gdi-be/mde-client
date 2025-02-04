<script lang="ts">
  import Button, { Icon, Label } from "@smui/button";
  import { onDestroy, onMount } from "svelte";

  type ScrollToTopButtonProps = {
    target?: HTMLElement;
  };

  const {
    target
  }: ScrollToTopButtonProps = $props();

  const scrollToTop = () => {
    target?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  let visible = $state(false);

  let mutationObserver: MutationObserver;
  let resizeObserver: ResizeObserver;

  onMount(() => {
    if (typeof window === 'undefined') return; // Sicherstellen, dass es nur im Browser läuft

    mutationObserver = new MutationObserver(() => {
      if (!target) return;
      visible = target.scrollHeight > target.clientHeight;
    });

    resizeObserver = new ResizeObserver(() => {
      if (!target) return;
      visible = target.scrollHeight > target.clientHeight;
    });

    if (target) {
      visible = target.scrollHeight > target.clientHeight;
      mutationObserver.observe(target, { attributes: true, childList: true, subtree: true });
      resizeObserver.observe(target);
    }

    onDestroy(() => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
    });
  });

</script>

{#if visible}
  <Button
    type="button"
    class="scroll-to-top-button"
    title="Nach oben scrollen"
    onclick={scrollToTop}
  >
    <Icon class="material-icons">stat_1</Icon>
    <Label>Nach oben</Label>
    <Icon class="material-icons">stat_1</Icon>
  </Button>
{/if}
