<script>
  import * as m from '$lib/paraglide/messages';
</script>

<div>
  <p>{ m.pageNotFound() }</p>
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
