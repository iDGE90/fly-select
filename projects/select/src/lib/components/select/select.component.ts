import {
  ChangeDetectorRef,
  Component,
  ContentChild, DoCheck,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
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
  encapsulation: ViewEncapsulation.None,
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
export class SelectComponent implements OnInit, DoCheck, ControlValueAccessor {
  private _originalData: any = null;
  private _options: Array<SelectOption> = [];
  private _groups: Array<SelectGroup> = [];
  private _placeholder: string = null;
  private _dataType: string = null;

  private differ: KeyValueDiffer<string, any>;

  @HostBinding() tabindex = 1;
  @HostBinding('class.host-focus') focused = false;
  @HostBinding('class.styleless') _style = false;

  @ContentChild(SelectGroupBodyDirective, {read: TemplateRef})
  groupTemplate: TemplateRef<any>;

  @ContentChild(SelectItemBodyDirective, {read: TemplateRef})
  optionTemplate: TemplateRef<any>;

  @ViewChild('selectBodyWrapper') selectBodyWrapper: ElementRef;

  // Properties to convert array into proper shape
  @Input('labelProperty') labelProperty: string = null;
  @Input('valueProperty') valueProperty: string = null;
  @Input('groupLabelProperty') groupLabelProperty: string = null;
  @Input('groupOptionsProperty') groupOptionsProperty: string = null;

  @Input('style')
  set style(boolean) {
    this._style = !boolean;
  }

  // Select options data
  @Input('data')
  set data(arr) {
    this._originalData = arr;

    const olp = this.labelProperty;
    const ovp = this.valueProperty;
    const glp = this.groupLabelProperty;
    const gop = this.groupOptionsProperty;

    const extractedData = SelectService.extractData(arr, olp, ovp, glp, gop);

    if (extractedData) {
      this._dataType = extractedData.dataType;

      if (extractedData.dataType === 'groups') {
        this._groups = extractedData.groups;
      }

      if (extractedData.dataType === 'options') {
        this._options = extractedData.options;
      }

      if (!this.differ && arr) {
        this.differ = this.differs.find(arr).create();
      }
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
  @HostListener('click', ['$event'])
  handleClickOutsideHost(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  // Hide select list if esc pressed
  @HostListener('keyup.esc')
  handleKeyboardEsc() {
    this.onHostBlur();
    this.close();
  }

  // Highlight option if arrow key pressed
  @HostListener('keydown.arrowdown', ['$event'])
  handleKeyboardArrowDown(e: KeyboardEvent) {
    // If select is open
    if (this.isOpen) {
      e.preventDefault();

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

      SelectService.setScrollFromBottom(this.selectBodyWrapper, this.data, this.highlightIndex);
    } else {
      // If select is closed
      if (this.focused) {
        e.preventDefault();
        this.toggle();
      }
    }
  }

  // Highlight option if arrow key pressed
  @HostListener('keydown.arrowup', ['$event'])
  handleKeyboardArrowUp(e: KeyboardEvent) {
    // If select is open
    if (this.isOpen) {
      e.preventDefault();

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

      SelectService.setScrollFromTop(this.selectBodyWrapper, this.data, this.highlightIndex);
    }
  }

  // Select highlighted option when key enter pressed
  @HostListener('keyup.enter')
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
    if (!this.disabled) {
      this.focused = true;
    }
  }

  @HostListener('blur')
  onHostBlur() {
    this.focused = false;
    this.close();
  }

  constructor(private cdr: ChangeDetectorRef,
              private eRef: ElementRef,
              private differs: KeyValueDiffers) {
  }

  ngOnInit() {
  }

  ngDoCheck() {
    if (this.differ) {
      const changes = this.differ.diff(this._originalData);

      if (changes) {
        this.data = this._originalData;
      }
    }
  }

  handleHeadClick() {
    this.toggle();
  }

  handleSelectItem(item: SelectOption) {
    this.selectedOption = item;
    this.isOpen = false;
    // this.highlightIndex = SelectService.resetHighlightIndex();

    this.onHostBlur();

    this.selected.emit(item);

    this.onChangeCallback(item.value);
    this.onTouchedCallback(item.value);
    this.cdr.markForCheck();
  }

  handleItemMouseEnter(optionIndex: number, groupIndex: number = -1) {
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
        if (this.dataType === 'groups') {
          for (let i = 0; i < this.groups.length; i++) {
            const option = this.groups[i].groupOptions.find(o => o.original === obj);

            if (option) {
              this.selectedOption = option;
              break;
            }
          }
        }

        if (this.dataType === 'options') {
          this.selectedOption = this.options.find(o => o.original === obj);
        }

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

  // If there is default option, select it and scroll if out of view
  selectAndScroll() {
    if (this.highlightIndex.optionIndex === -1 && this.highlightIndex.groupIndex === -1) {
      if (this.selectedOption) {
        if (this.dataType === 'groups') {
          for (let i = 0; i < this.groups.length; i++) {
            const optionIndex = this.groups[i].groupOptions.indexOf(this.selectedOption);

            if (optionIndex !== -1) {
              this.highlightIndex.groupIndex = i;
              this.highlightIndex.optionIndex = optionIndex;
              break;
            }
          }
        }

        if (this.dataType === 'options') {
          this.highlightIndex.optionIndex = this.options.indexOf(this.selectedOption);
        }
      }
    }

    setTimeout(() => {
      SelectService.setScrollFromBottom(this.selectBodyWrapper, this.data, this.highlightIndex);
    }, 25);
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

      if (this.isOpen) {
        this.selectAndScroll();
      }

      if (!this.isOpen) {
        this.onTouchedCallback({});
      }
    }
  }
}

