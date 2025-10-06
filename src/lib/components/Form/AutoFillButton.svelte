<script lang="ts">
  import IconButton from '@smui/icon-button';
  import { Icon } from '@smui/button';
  import { page } from '$app/state';

  const t = $derived(page.data.t);
  const defaultTitle = $derived(t('autofillbutton.title'));
  let { onclick, title } = $props();
</script>

<IconButton title={title || defaultTitle} type="button" size="button" {onclick}>
  <Icon class="material-icons">brightness_auto</Icon>
</IconButton>

<style>
</style>
