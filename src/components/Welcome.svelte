<script>
  import * as m from '$lib/paraglide/messages';
  const userName = 'Peter';
</script>

<div class="welcome">
  <h1>{m.title({ name: userName})}</h1>
  <p>
    {m.welcome()}
  </p>
  <a href="/editor">editor</a>
</div>

<style lang="less">
  .welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;

    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.5rem;
      color: #666;
    }
  }
</style>
