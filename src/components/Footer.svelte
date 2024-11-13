<script>
  let { text = 'Footer' } = $props();
</script>

<style>
  footer {
    background-color: #f8f9fa;
    padding: 1rem;
    text-align: center;
    border-top: 1px solid #dee2e6;
    align-self: stretch;
  }
</style>

<footer>
  {text}
</footer>
