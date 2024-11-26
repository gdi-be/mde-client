<script>
  import FormItem from "./FormItem.svelte";

  let { metadata } = $props();
  $effect(() => {
    console.log(metadata);
  });
</script>

<form>
  <FormItem
    type="integer"
    key="isometadata.number"
    label="Zahlenfeld (Ganzahl)"
  />
  <FormItem
    type="float"
    key="isometadata.float"
    label="Zahlenfeld (Dezimal)"
  />
  <FormItem
    type="text"
    key="isometadata.text"
    label="Freitextfeld"
  />
  <FormItem
    type="textarea"
    key="isometadata.textarea"
    label="Fließtextfeld"
  />
  <FormItem
    type="boolean"
    key="isometadata.boolean"
    label="Entscheidung"
  />
  <FormItem
    type="date"
    key="isometadata.date"
    label="Datumsauswahl"
  />
  <FormItem
    type="select"
    key="isometadata.select"
    label="Auswahlliste"
  />
  <FormItem
    type="autocomplete"
    key="isometadata.autocomplete"
    label="Thesaurusaufschlag"
  />
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
  }

</style>
