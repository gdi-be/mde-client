/* eslint-disable @typescript-eslint/no-explicit-any */
export type Option = Record<string, string | number>;

export type FormItemType = 'text' | 'integer' | 'float' | 'textarea' | 'boolean' | 'select' | 'autocomplete' | 'date' | 'list' | 'group';

export type VisibilityCondition = `${string}` | `${string} == ${string}` | `${string} != ${string}`;

export interface BaseFormItemConfig {
  type: FormItemType;
  section?: string;
  key: string;
  label?: string;
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/required
  required?: boolean;
  help?: string;
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title
  title?: string;
  /**
   * Id of a list item. This is a computed value and should not be set manually.
   */
  listId?: string;
  /**
   * Visibility condition for form items.
   * e.g. `"metadataProfile == INSPIRE"`
   */
  visibilityCondition?: VisibilityCondition;
}

export type TextInputConfig = BaseFormItemConfig & {
  type: 'text';
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern
  pattern?: string;
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/maxlength
  maxlength?: number;
}

export type IntegerInputConfig = BaseFormItemConfig & {
  type: 'integer';
  min?: number;
  max?: number;
  step?: number;
}

export type FloatInputConfig = BaseFormItemConfig & {
  type: 'float';
  min?: number;
  max?: number;
  step?: number;
}

export type TextAreaInputConfig = BaseFormItemConfig & {
  type: 'textarea';
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/maxlength
  maxlength?: number;
}

export type BooleanInputConfig = BaseFormItemConfig & {
  type: 'boolean';
}

export type DateInputConfig = BaseFormItemConfig & {
  type: 'date';
  min?: string;
  max?: string;
}

export type SelectInputConfig = BaseFormItemConfig & {
  type: 'select';
  options: Option[];
}

export type AutocompleteInputConfig = BaseFormItemConfig & {
  type: 'autocomplete';
  options: Option[];
}

export type FormListConfig = BaseFormItemConfig & {
  type: 'list';
  item: ListItemConfig;
}

export type FormGroupConfig = BaseFormItemConfig & {
  type: 'group';
  label?: string;
  layout?: 'horizontal' | 'vertical';
  items: GroupItemConfig[];
}

export type FormItemConfig =
  TextInputConfig |
  IntegerInputConfig |
  FloatInputConfig |
  TextAreaInputConfig |
  BooleanInputConfig |
  DateInputConfig |
  SelectInputConfig |
  AutocompleteInputConfig;

export type FormStructureConfig = FormListConfig | FormGroupConfig;

export type ListItemConfig = Omit<FormItemConfig, 'section' | 'key'> & {
  label?: string;
};

export type GroupItemConfig = Omit<FormItemConfig, 'section'>;

export type FormConfig = {
  sections: string[];
  formItems: (FormItemConfig | FormStructureConfig)[];
}

export function isFormItemConfig(config: any): config is FormItemConfig {
  return isTextInputConfig(config) ||
    isIntegerInputConfig(config) ||
    isFloatInputConfig(config) ||
    isTextAreaInputConfig(config) ||
    isBooleanInputConfig(config) ||
    isDateInputConfig(config) ||
    isSelectInputConfig(config) ||
    isAutocompleteInputConfig(config);
}

export function isTextInputConfig(config: any): config is TextInputConfig {
  return config.type === 'text';
}

export function isIntegerInputConfig(config: any): config is IntegerInputConfig {
  return config.type === 'integer';
}

export function isFloatInputConfig(config: any): config is FloatInputConfig {
  return config.type === 'float';
}

export function isTextAreaInputConfig(config: any): config is TextAreaInputConfig {
  return config.type === 'textarea';
}

export function isBooleanInputConfig(config: any): config is BooleanInputConfig {
  return config.type === 'boolean';
}

export function isDateInputConfig(config: any): config is DateInputConfig {
  return config.type === 'date';
}

export function isSelectInputConfig(config: any): config is SelectInputConfig {
  return config.type === 'select';
}

export function isAutocompleteInputConfig(config: any): config is AutocompleteInputConfig {
  return config.type === 'autocomplete';
}

export function isFormItemListConfig(config: any): config is FormListConfig {
  return config.type === 'list';
}

export function isFormItemGroupConfig(config: any): config is FormGroupConfig {
  return config.type === 'group';
}
