<script lang="ts">
  import { page } from '$app/state';
  import IconButton from '@smui/icon-button';
  import { Icon } from '@smui/button';
  import { getFormContext, toggleActiveHelp } from '$lib/context/FormContext.svelte';

  const t = $derived(page.data.t);
  let { key } = $props();

  const { activeHelpKey } = $derived(getFormContext());

  const pressed = $derived(key === activeHelpKey);
</script>

<IconButton
  title={t('helpbutton.title')}
  type="button"
  toggle
  size="button"
  {pressed}
  onclick={() => toggleActiveHelp(key)}
>
  <Icon class="material-icons">help</Icon>
  <Icon class="material-icons-filled" on>help</Icon>
</IconButton>
