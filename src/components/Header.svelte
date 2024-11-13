<script>
  let { text = 'Header' } = $props();
</script>

<style>
  header {
    background-color: #f8f9fa;
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid #dee2e6;
    align-self: stretch;
  }
</style>

<header>
  {text}
</header>
