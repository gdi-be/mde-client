<div>
  <form>
    <input type="text" placeholder="Page title" />
    <textarea placeholder="Page content"></textarea>
    <button type="submit">Save</button>
  </form>
  <a href="/">Zurück</a>
</div>


<style lang="less">
  form {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;

    input, textarea {
      padding: 0.5rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 0.25rem;
    }

    button {
      padding: 0.5rem 1rem;
      font-size: 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
    }
  }
</style>
