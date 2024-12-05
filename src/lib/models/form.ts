export type Option = Record<string, string | number>;

export type FormItemType = 'text' | 'integer' | 'float' | 'textarea' | 'boolean' | 'select' | 'autocomplete' | 'date';

export interface BaseFormItemConfig {
  section: string;
  key: string;
  label: string;
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/required
  required?: boolean;
  help?: string;
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title
  title?: string;
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

export type TextAreaConfig = BaseFormItemConfig & {
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

export type FormItemConfig =
  TextInputConfig |
  IntegerInputConfig |
  FloatInputConfig |
  TextAreaConfig |
  BooleanInputConfig |
  DateInputConfig |
  SelectInputConfig |
  AutocompleteInputConfig;

export type FormConfig = {
  sections: string[];
  formItems: FormItemConfig[];
}
