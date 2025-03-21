<script lang="ts">
  import Chip, { Text } from "@smui/chips";
  import { getStatusName } from "../context/StatusesContest.svelte";

  const {
    chip,
    colored = false,
    mini = false
  } = $props();

  const getClass = (key: string) => {
    const classes = ['status-chip'];
    if (mini) {
      classes.push('mini');
    }
    if (colored) {
      classes.push('colored');
    }
    classes.push(key.toLowerCase());
    return classes.join(' ');
  }

</script>

<Chip
  class={getClass(chip)}
  {chip}
>
  <Text tabindex={0}>{getStatusName(chip)}</Text>
</Chip>

<style lang="scss">
  :global(.status-chip.mini) {
    height: 24px;
    font-size: 0.7rem;
  }

  :global(.status-chip.colored.assigned_to_me) {
    background-color: var(--assigned-to-me-color);
  }
  :global(.status-chip.colored.assigned_to_team) {
    background-color: var(--assigned-to-team-color);
  }
  :global(.status-chip.colored.ready_for_release) {
    background-color: var(--ready-for-release-color);
  }
  :global(.status-chip.colored.role_dataowner) {
    background-color: var(--data-owner-color);
  }
  :global(.status-chip.colored.role_editor) {
    background-color: var(--editor-color);
  }
  :global(.status-chip.colored.role_qualityassurance) {
    background-color: var(--quality-assurance-color);
  }
</style>
