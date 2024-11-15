<script>
  let { text = 'Footer' } = $props();
</script>

<footer>
  <div>
  </div>
  <div>
    {text}
  </div>
  <div>
  </div>
</footer>

<style>
  footer {
    background-color: #f8f9fa;
    height: 3em;
    text-align: center;
    border-bottom: 1px solid #dee2e6;
    align-self: stretch;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
