export interface SelectOption {
  label: number | string;
  value: number | string;
  original: any;
}

export interface SelectGroup {
  groupLabel: string | number;
  groupOptions: Array<SelectOption>;
  groupOriginal: any;
}

export interface SelectHighlightIndex {
  optionIndex: number;
  groupIndex: number;
}

export interface SelectData {
  dataType: 'groups' | 'options';
  options?: Array<SelectOption>;
  groups?: Array<SelectGroup>;
}

export interface SelectOptionData {
  label: string | number;
  value: string | number;
  original: any;
}

export interface SelectGroupData {
  label: string | number;
  options: Array<any>;
  original: any;
}
