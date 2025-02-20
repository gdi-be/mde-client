<script lang="ts">
  import IconButton from '@smui/icon-button';
  import { Icon } from '@smui/button';

  let { onclick } = $props();
</script>

<IconButton title="Feld automatisch ausfüllen/ergänzen" type="button" size="button" {onclick}>
  <Icon class="material-icons">brightness_auto</Icon>
</IconButton>

<style>
</style>
