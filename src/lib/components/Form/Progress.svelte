<script lang="ts">
  import { expoOut } from "svelte/easing";
  import { Tween } from "svelte/motion";

  let {
    required = 0,
    optional = 0,
    total = 0,
    title = (required: number, optional: number, total: number) => {
      if (required === 0 && optional === 0) {
        return "Alle Felder wurde ausgefüllt und sind valide.";
      }
      return `Von insgesamt ${total} Feldern sind ${required + optional} ungültig bzw leer. Darunter ${required} Pflichtfeld(er).`;
    }
  } = $props();

  const RADIUS = 10;
  const arc = $derived(Math.PI * RADIUS * 2 / 2);

  const requiredPercent = $derived(required / total * 100);
  const optionalPercent = $derived(optional / total * 100);
  const redDash = $derived(requiredPercent * arc / 100);
  const yellowDash = $derived((optionalPercent * arc / 100) + redDash);
  const redDashTween = Tween.of(() => redDash, { easing: expoOut, duration: 1000 });
  const yellowDashTween = Tween.of(() => yellowDash, { easing: expoOut, duration: 1000});

</script>

<div
  class="progress-chart"
  title={title(required, optional, total)}
>
  <svg viewBox="0 0 20 20">
    <circle r={RADIUS} cx="10" cy="10" fill="#0f913b" />
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
