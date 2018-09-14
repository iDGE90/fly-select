export interface SelectOption {
  label: number | string;
  value: number | string;
  original: any;
}

export interface SelectGroup {
  groupLabel: string | number;
  groupOptions: Array<SelectOption>;
}

export interface SelectHighlightIndex {
  optionIndex: number;
  groupIndex: number;
}
