import {
  ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnInit, Output,
  TemplateRef
} from '@angular/core';
import {SelectOption} from '../../models/select-data';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {animate, state, style, transition, trigger} from '@angular/animations';

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

      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({opacity: 1})),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [
        style({opacity: 0}),
        animate(100)
      ]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave',
        animate(100, style({opacity: 0})))
    ])
  ]
})
export class SelectComponent implements OnInit, ControlValueAccessor {
  private _options: Array<SelectOption> = [];
  private _placeholder: string = null;

  @ContentChild(TemplateRef)
  @Input() layoutTemplate: TemplateRef<any>;

  // Properties to convert array into proper shape
  @Input('labelProperty') labelProperty: string = null;
  @Input('valueProperty') valueProperty: string = null;

  // Select options data
  @Input('options')
  set options(arr) {
    this._options = [];

    for (const option of arr) {
      this._options.push({
        value: this.valueProperty ? option[this.valueProperty] : option['value'],
        label: this.labelProperty ? option[this.labelProperty] : option['label'],
        original: option
      });
    }
  }

  get options(): Array<SelectOption> {
    return this._options;
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

  // Index of the highlighted option (can select option with pressing enter)
  highlightIndex: number = null;

  // Hide select list if clicked outside component
  @HostListener('document:click', ['$event'])
  handleClickOutsideHost(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  // Hide select list if esc pressed
  @HostListener('document:keyup.esc', ['$event'])
  handleKeyboardEsc(event: KeyboardEvent) {
    this.close();
  }

  // Highlight option if arrow key pressed
  @HostListener('document:keyup.arrowdown', ['$event'])
  handleKeyboardArrowDown(event: KeyboardEvent) {
    if (this.isOpen) {
      if (this.highlightIndex === null) {
        this.highlightIndex = 0;
      } else {
        if (this.highlightIndex < this.options.length - 1) {
          this.highlightIndex++;
        }
      }
    }
  }

  // Highlight option if arrow key pressed
  @HostListener('document:keyup.arrowup', ['$event'])
  handleKeyboardArrowUp(event: KeyboardEvent) {
    if (this.isOpen) {
      if (this.highlightIndex !== null) {
        if (this.highlightIndex !== 0) {
          this.highlightIndex--;
        }
      }
    }
  }

  // Select higlighted option when key enter pressed
  @HostListener('document:keyup.enter', ['$event'])
  handleKeyboardEnter(event: KeyboardEvent) {
    if (this.isOpen && this.highlightIndex !== null) {
      const option = this.options[this.highlightIndex];
      this.handleSelectItem(option);
    }
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
    this.highlightIndex = null;

    this.selected.emit(item);

    this.onChangeCallback(item.value);
    this.onTouchedCallback(item.value);
    this.cdr.markForCheck();
  }

  handleItemMouseMove(option: SelectOption) {
    if (this.highlightIndex !== this.options.indexOf(option)) {
      this.highlightIndex = this.options.indexOf(option);
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
  isHighlight(option: SelectOption) {
    const index = this.options.indexOf(option);

    return this.highlightIndex === index && index !== -1;
  }

  // Hide select body
  close() {
    if (this.isOpen) {
      this.toggle();
    }
  }

  // Toggle select body
  toggle() {
    this.isOpen = !this.isOpen;
    this.highlightIndex = null;

    if (!this.isOpen) {
      this.onTouchedCallback({});
    }
  }

}

