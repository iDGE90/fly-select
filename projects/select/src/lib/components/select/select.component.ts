import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import {SelectGroup, SelectHighlightIndex, SelectOption} from '../../models/select-data';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {SelectService} from '../../services/select.service';
import {SelectItemBodyDirective} from '../../directives/select-item-body.directive';
import {SelectGroupBodyDirective} from '../../directives/select-group-body.directive';

const SELECT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectComponent),
  multi: true,
};

@Component({
  selector: 'fly-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [SELECT_CONTROL_VALUE_ACCESSOR],
  animations: [
    trigger('fade', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(100)
      ]),
      transition(':leave',
        animate(100, style({opacity: 0})))
    ])
  ]
})
export class SelectComponent implements OnInit, ControlValueAccessor {
  private _options: Array<SelectOption> = [];
  private _groups: Array<SelectGroup> = [];
  private _placeholder: string = null;
  private _dataType: string = null;

  @HostBinding() tabindex = 1;
  @HostBinding('class.host-focus') focused = false;

  @ContentChild(SelectGroupBodyDirective, { read: TemplateRef })
  groupTemplate: TemplateRef<any>;

  @ContentChild(SelectItemBodyDirective, { read: TemplateRef })
  optionTemplate: TemplateRef<any>;

  // Properties to convert array into proper shape
  @Input('labelProperty') labelProperty: string = null;
  @Input('valueProperty') valueProperty: string = null;

  // Select options data
  @Input('data')
  set data(arr) {
    const extractedData = SelectService.extractData(arr, this.labelProperty, this.valueProperty);

    this._dataType = extractedData.dataType;

    if (extractedData.dataType === 'groups') {
      this._groups = extractedData.groups;
    }

    if (extractedData.dataType === 'options') {
      this._options = extractedData.options;
    }
  }

  get groups(): Array<SelectGroup> {
    return this._groups;
  }

  get options(): Array<SelectOption> {
    return this._options;
  }

  get data(): Array<SelectGroup> | Array<SelectOption> {
    if (this._dataType === 'groups') {
      return this._groups;
    }

    if (this._dataType === 'options') {
      return this._options;
    }
  }

  // Get type of data
  get dataType(): string {
    return this._dataType;
  }

  // Select placeholder text (when no option is selected)
  @Input('placeholder')
  set placeholder(str: string) {
    this._placeholder = str;
  }

  get placeholder(): string {
    return this._placeholder ? this._placeholder : 'Select option';
  }

  // Event when option is selected
  @Output() selected = new EventEmitter<SelectOption>();

  // Value that is selected
  selectedOption: SelectOption = null;

  // Select body visible/hidden
  isOpen = false;

  // Is select disabled?
  disabled = false;

  // Index of the highlighted option and group if existing (can select option with pressing enter)
  highlightIndex: SelectHighlightIndex = SelectService.resetHighlightIndex();

  // Hide select list if clicked outside component
  @HostListener('document:click', ['$event'])
  handleClickOutsideHost(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  // Hide select list if esc pressed
  @HostListener('document:keyup.esc')
  handleKeyboardEsc() {
    this.onHostBlur();
    this.close();
  }

  // Highlight option if arrow key pressed
  @HostListener('document:keydown.arrowdown')
  handleKeyboardArrowDown() {
    if (this.isOpen) {
      // If select is open
      if (this.dataType === 'groups') {
        if (this.highlightIndex.optionIndex === -1 && this.highlightIndex.groupIndex === -1) {
          // If there is no option selected
          this.highlightIndex.optionIndex = 0;
          this.highlightIndex.groupIndex = 0;
        } else {
          // If there is an option selected
          if (this.highlightIndex.optionIndex < this._groups[this.highlightIndex.groupIndex].groupOptions.length - 1) {
            this.highlightIndex.optionIndex++;
          } else {
            if (this.highlightIndex.groupIndex < this._groups.length - 1) {
              // If at the end of group
              this.highlightIndex.optionIndex = 0;
              this.highlightIndex.groupIndex++;
            }
          }
        }
      }

      if (this.dataType === 'options') {
        if (this.highlightIndex.optionIndex === -1) {
          this.highlightIndex.optionIndex = 0;
        } else {
          if (this.highlightIndex.optionIndex < this.options.length - 1) {
            this.highlightIndex.optionIndex++;
          }
        }
      }
    } else {
      // If select is closed
      if (this.focused) {
        this.toggle();
      }
    }
  }

  // Highlight option if arrow key pressed
  @HostListener('document:keydown.arrowup')
  handleKeyboardArrowUp() {
    if (this.isOpen) {
      if (this.dataType === 'groups') {
        if (this.highlightIndex.optionIndex !== 0 || this.highlightIndex.groupIndex !== 0) {
          if (this.highlightIndex.optionIndex === 0) {
            this.highlightIndex.groupIndex--;
            this.highlightIndex.optionIndex = this._groups[this.highlightIndex.groupIndex].groupOptions.length - 1;
          } else {
            this.highlightIndex.optionIndex--;
          }
        }
      }

      if (this.dataType === 'options') {
        if (this.highlightIndex.optionIndex !== 0) {
          this.highlightIndex.optionIndex--;
        }
      }
    }
  }

  // Select highlighted option when key enter pressed
  @HostListener('document:keyup.enter')
  handleKeyboardEnter() {
    if (this.isOpen && this.highlightIndex !== {optionIndex: -1, groupIndex: -1}) {
      if (this.dataType === 'groups') {
        const option = this._groups[this.highlightIndex.groupIndex].groupOptions[this.highlightIndex.optionIndex];
        this.handleSelectItem(option);
      }

      if (this.dataType === 'options') {
        const option = this.options[this.highlightIndex.optionIndex];
        this.handleSelectItem(option);
      }
    }
  }

  @HostListener('focus')
  onHostFocus() {
    this.focused = true;
  }

  @HostListener('blur')
  onHostBlur() {
    this.focused = false;
    this.close();
  }

  constructor(private cdr: ChangeDetectorRef,
              private eRef: ElementRef) {
  }

  ngOnInit() {
  }

  handleHeadClick() {
    this.toggle();
  }

  handleSelectItem(item: SelectOption) {
    this.selectedOption = item;
    this.isOpen = false;
    this.highlightIndex = SelectService.resetHighlightIndex();

    this.onHostBlur();

    this.selected.emit(item);

    this.onChangeCallback(item.value);
    this.onTouchedCallback(item.value);
    this.cdr.markForCheck();
  }

  handleItemMouseMove(optionIndex: number, groupIndex: number = -1) {
    if (optionIndex !== this.highlightIndex.optionIndex || groupIndex !== this.highlightIndex.groupIndex) {
      this.highlightIndex = {
        optionIndex,
        groupIndex
      };
    }
  }

  writeValue(obj: any): void {
    if (this.cdr) {
      if (obj) {
        this.selectedOption = this.options.find(o => o.original === obj);
      }
      this.cdr.markForCheck();
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  private onTouchedCallback(v: any) {
  }

  private onChangeCallback(v: any) {
  }

  // Is select option highlighted
  isHighlight(optionIndex: number, groupIndex: number = -1): boolean {
    return this.highlightIndex.optionIndex === optionIndex
      && this.highlightIndex.groupIndex === groupIndex;
  }

  // Hide select body
  close() {
    if (this.isOpen) {
      this.toggle();
    }
  }

  // Toggle select body
  toggle() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      this.highlightIndex = SelectService.resetHighlightIndex();

      if (!this.isOpen) {
        this.onTouchedCallback({});
      }
    }
  }
}
