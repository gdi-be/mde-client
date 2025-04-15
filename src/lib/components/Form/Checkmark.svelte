<script lang="ts">
  type CheckmarkProps = {
    hideMs?: number;
    running: boolean;
    displayNone?: boolean;
  };

  let {
    hideMs = 2000,
    displayNone = false,
    running = $bindable<boolean>(false)
  }: CheckmarkProps = $props();

  function onAnimationStart() {
    running = true;
  }

  function onAnimationEnd() {
    setTimeout(() => {
      running = false;
    }, hideMs);
  }
</script>

<svg
  class={['checkmark', running && 'running']}
  style={displayNone && !running ? 'display: none;' : ''}
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 52 52"
  onanimationstart={onAnimationStart}
  onanimationend={onAnimationEnd}
>
  <circle class="checkmark__circle" cx="26" cy="26" r="26" fill="none" />
  <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
</svg>

<style lang="scss">
  .checkmark {
    --check-color: white;
    --background: var(--mdc-theme-primary, green);
    --curve: cubic-bezier(0.65, 0, 0.45, 1);

    width: 1em;
    height: 1em;
    stroke-width: 6;
    stroke: var(--check-color);
    stroke-miterlimit: 10;
    box-shadow: inset 0px 0px 0px var(--background);
    border-radius: 50%;

    .checkmark__circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 2;
      stroke-miterlimit: 10;
      stroke: var(--background);
      fill: none;
    }

    .checkmark__check {
      transform-origin: 50% 50%;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
    }

    &.running {
      display: unset;
      animation:
        fill 0.4s ease-in-out 0.4s forwards,
        scale 0.3s ease-in-out 0.9s both;

      .checkmark__circle {
        animation: stroke 0.6s var(--curve) forwards;
      }

      .checkmark__check {
        animation: stroke 0.3s var(--curve) 0.8s forwards;
      }
    }
  }

  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes scale {
    0%,
    100% {
      transform: none;
    }
    50% {
      transform: scale3d(1.1, 1.1, 1);
    }
  }

  @keyframes fill {
    100% {
      box-shadow: inset 0px 0px 0px 30px var(--background);
    }
  }
</style>
