<script lang="ts">
  import IconButton from '@smui/icon-button';
  import { Icon } from '@smui/button';

  let {
    onclick,
    title = 'Feld automatisch ausfüllen/ergänzen',
  } = $props();
</script>

<IconButton {title} type="button" size="button" {onclick}>
  <Icon class="material-icons">brightness_auto</Icon>
</IconButton>

<style>
</style>
