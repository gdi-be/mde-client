<script lang="ts">
  import { Tween } from "svelte/motion";

  let {
    required = 0,
    optional = 0,
    title = "Fortschritt (TODO: details)"
  } = $props();

  const RADIUS = 10;
  const arc = $derived(Math.PI * RADIUS * 2 / 2);
  const redDash = $derived(required * arc / 100);
  const yellowDash = $derived((optional * arc / 100) + redDash);

  const redDashTween = Tween.of(() => redDash);
  const yellowDashTween = Tween.of(() => yellowDash);

</script>

<div
  class="progress-chart"
  {title}
>
  <svg viewBox="0 0 20 20">
    <circle r={RADIUS} cx="10" cy="10" fill="#48bb46" />
    <circle
      r={RADIUS / 2}
      cx="10"
      cy="10"
      fill="transparent"
      stroke="#fdea59"
      stroke-width="10"
      stroke-dasharray={`${yellowDashTween.current} ${arc}`}
      transform="rotate(-90) translate(-20)"
    />
    <circle
      r={RADIUS / 2}
      cx="10"
      cy="10"
      fill="transparent"
      stroke="#ff3a3a"
      stroke-width="10"
      stroke-dasharray={`${redDashTween.current} ${arc}`}
      transform="rotate(-90) translate(-20)"
    />
  </svg>
</div>

<style lang="scss">
  .progress-chart {
    cursor: default;
    height: 0.75em;
    width: 0.75em;

    svg {
      display: block;
      height: 100%;
      width: 100%;
    }

  }
</style>
