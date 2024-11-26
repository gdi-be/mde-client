<script lang="ts">
  import AutoCompleteInput from "./Inputs/AutoCompleteInput.svelte";
  import BooleanInput from "./Inputs/BooleanInput.svelte";
  import DateInput from "./Inputs/DateInput.svelte";
  import NumberInput from "./Inputs/NumberInput.svelte";
  import SelectInput from "./Inputs/SelectInput.svelte";
  import TextAreaInput from "./Inputs/TextAreaInput.svelte";
  import TextInput from "./Inputs/TextInput.svelte";
  import Tooltip, { Content, RichActions, Title, Wrapper } from "@smui/tooltip";
  import Button, { Icon, Label } from "@smui/button";

  type FormItemType = 'text' | 'integer' | 'float' | 'textarea' | 'boolean' | 'select' | 'autocomplete' | 'date';
  type FormItemProps = {
    type: FormItemType,
    label: string,
    key: string,
    dataSource?: string
  }

  let {
    type,
    label,
    key
  }: FormItemProps = $props();

</script>

<div class="form-item">
  <div class="form-input">
    {#if type === 'text'}
      <TextInput {key} {label}/>
    {/if}
    {#if type === 'integer'}
      <NumberInput type="integer" {key} {label}  />
    {/if}
    {#if type === 'float'}
      <NumberInput type="float" {key} {label} />
    {/if}
    {#if type === 'textarea'}
      <TextAreaInput {key} {label} />
    {/if}
    {#if type === 'boolean'}
      <BooleanInput {key} {label} />
    {/if}
    {#if type === 'date'}
      <DateInput {key} {label} />
    {/if}
    {#if type === 'select'}
      <SelectInput {key} {label} />
    {/if}
    {#if type === 'autocomplete'}
      <AutoCompleteInput {key} {label} />
    {/if}
  </div>
  <div class="help-icon">
    <Wrapper rich>
      <Icon class="material-icons">
        info
      </Icon>
      <Tooltip interactive>
        <Title>{key}</Title>
        <Content>
          An interactive rich tooltip can have <a href="/editor">links</a>.
        </Content>
        <RichActions>
          <Button><Label>Action</Label></Button>
        </RichActions>
      </Tooltip>
    </Wrapper>
  </div>
</div>

<style lang="less">
  .form-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 1em;
    border-radius: 5px;

    &:nth-child(odd) {
      background-color: #f6f6f6;
    }

    .help-icon {
      color: grey;

      :global(i.material-icons) {
        cursor: pointer;
      }

      :global(.mdc-tooltip) {
        min-width: 200px;
      }
    }
  }

</style>
