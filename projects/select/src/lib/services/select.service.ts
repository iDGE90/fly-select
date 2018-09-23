import {Injectable} from '@angular/core';
import {SelectGroup, SelectHighlightIndex, SelectOption} from '../models/select-data';

@Injectable({
  providedIn: 'root'
})
export class SelectService {
  constructor() {
  }

  static extractData(arr, labelProp, valueProp): {
    dataType: 'groups' | 'options';
    options?: Array<SelectOption>;
    groups?: Array<SelectGroup>
  } {
    const data = [];
    let dataType = null;

    for (const group of arr) {
      if (group.hasOwnProperty('groupLabel') && group.hasOwnProperty('groupOptions')) {
        const groupItem = {
          groupLabel: group.groupLabel,
          groupOriginal: {},
          groupOptions: []
        };

        dataType = 'groups';

        if (Array.isArray(group.groupOptions)) {
          for (const option of group.groupOptions) {
            if ((option.hasOwnProperty('label') && option.hasOwnProperty('value'))
              || (option.hasOwnProperty(labelProp) && option.hasOwnProperty(valueProp))) {
              groupItem.groupOptions.push({
                label: labelProp ? option[labelProp] : option.label,
                value: valueProp ? option[valueProp] : option.value,
                original: option
              });
            }
          }
        }

        // Populate group original without group options
        for (const prop in group) {
          if (group.hasOwnProperty(prop) && prop !== 'groupOptions') {
            groupItem.groupOriginal[prop] = group[prop];
          }
        }

        data.push(groupItem);
      }

      if ((group.hasOwnProperty('label') && group.hasOwnProperty('value'))
        || (group.hasOwnProperty(labelProp) && group.hasOwnProperty(valueProp))) {
        dataType = 'options';

        data.push({
          label: labelProp ? group[labelProp] : group.label,
          value: valueProp ? group[valueProp] : group.value,
          original: group
        });
      }
    }

    if (dataType === 'groups') {
      return {
        dataType,
        groups: data
      };
    }

    if (dataType === 'options') {
      return {
        dataType,
        options: data
      };
    }
  }

  static resetHighlightIndex(): SelectHighlightIndex {
    return {
      groupIndex: -1,
      optionIndex: -1
    };
  }

  static setScrollFromBottom(wrapperEl, data, highlightIndex: SelectHighlightIndex): void {
    const optionsNum = this.getItemNumbers(data, highlightIndex).numberOfOptions;
    const labelNum = this.getItemNumbers(data, highlightIndex).numberOfLabels;
    const optionHeight = this.getHeightsNumbers(wrapperEl).optionHeight;
    const labelHeight = this.getHeightsNumbers(wrapperEl).labelHeight;
    const minHeight = wrapperEl.nativeElement.clientHeight;
    const diff = labelNum * labelHeight + optionsNum * optionHeight;

    // If mouse scrolled, and highlighted is out of view
    if (diff < wrapperEl.nativeElement.scrollTop || diff > wrapperEl.nativeElement.scrollTop + minHeight) {
      wrapperEl.nativeElement.scrollTop = 0;
    }

    if (diff - minHeight > wrapperEl.nativeElement.scrollTop) {
      wrapperEl.nativeElement.scrollTop = diff - minHeight;
    }
  }

  static setScrollFromTop(wrapperEl, data, highlightIndex: SelectHighlightIndex): void {
    const optionsNum = this.getItemNumbers(data, highlightIndex).numberOfOptions;
    const labelNum = this.getItemNumbers(data, highlightIndex).numberOfLabels;
    const optionHeight = this.getHeightsNumbers(wrapperEl).optionHeight;
    const labelHeight = this.getHeightsNumbers(wrapperEl).labelHeight;
    const minHeight = wrapperEl.nativeElement.clientHeight;
    const diff = labelNum * labelHeight + (optionsNum - 1 ) * optionHeight;

    if (diff === wrapperEl.nativeElement.scrollTop) {
      wrapperEl.nativeElement.scrollTop = 0;
    }

    // If mouse scrolled, and highlighted is out of view
    if (diff < wrapperEl.nativeElement.scrollTop || diff > wrapperEl.nativeElement.scrollTop + minHeight) {
      wrapperEl.nativeElement.scrollTop = diff;
    }

    if (wrapperEl.nativeElement.scrollTop > diff) {
      // If first item highlighted, scroll to top (show group label)
      if (highlightIndex.groupIndex === 0 && highlightIndex.optionIndex === 0) {
        wrapperEl.nativeElement.scrollTop = 0;
      } else {
        wrapperEl.nativeElement.scrollTop = diff;
      }
    }
  }

  static getItemNumbers(data, highlightIndex: SelectHighlightIndex): {
    numberOfOptions: number;
    numberOfLabels: number;
  } {
    let optionsNum = 0;
    const labelNum = highlightIndex.groupIndex + 1;

    if (highlightIndex.groupIndex !== -1) {
      for (let i = 0; i <= highlightIndex.groupIndex; i++) {
        if (i === highlightIndex.groupIndex) {
          optionsNum += highlightIndex.optionIndex + 1;
        } else {
          optionsNum += data[i].groupOptions.length;
        }
      }
    } else {
      optionsNum = highlightIndex.optionIndex + 1;
    }

    return {
      numberOfOptions: optionsNum,
      numberOfLabels: labelNum
    };
  }

  static getHeightsNumbers(wrapperEl): {
    optionHeight: number;
    labelHeight: number;
  } {
    const option = wrapperEl.nativeElement.getElementsByClassName('fly-select-item-container')[0];
    const label = wrapperEl.nativeElement.getElementsByClassName('fly-select-group-label')[0];

    return {
      optionHeight: option ? option.offsetHeight : 0,
      labelHeight: label ? label.offsetHeight : 0
    };
  }
}
