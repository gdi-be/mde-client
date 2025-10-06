<script lang="ts">
  import { page } from '$app/state';

  const t = $derived(page.data.t);
</script>

<div>
  <p>{t('error.notFound')}</p>
</div>

<style lang="scss">
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;

    p {
      color: #666;
    }
  }
</style>
