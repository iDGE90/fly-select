import {Injectable} from '@angular/core';
import {
  SelectData, SelectGroupData, SelectHighlightIndex, SelectOptionData
} from '../models/select-data';

@Injectable({
  providedIn: 'root'
})
export class SelectService {
  static extractData(arr, labelProp, valueProp, groupLabelProp, groupOptionsProp): SelectData {
    const optionLabelString = labelProp ? labelProp : 'label';
    const optionValueString = valueProp ? valueProp : 'value';
    const groupLabelString = groupLabelProp ? groupLabelProp : 'groupLabel';
    const groupOptionsString = groupOptionsProp ? groupOptionsProp : 'groupOptions';

    let dataType = null;
    const data = [];

    for (const item of arr) {
      const groupData = this.getGroupData(item, groupLabelString, groupOptionsString);

      if (groupData) {
        const group = {
          groupLabel: groupData.label,
          groupOriginal: groupData.original,
          groupOptions: []
        };

        dataType = 'groups';

        for (const option of groupData.options) {
          // Option Data, in group
          const x = this.getOptionData(option, optionLabelString, optionValueString);

          if (x) {
            group.groupOptions.push(x);
          }
        }

        // Populate group original without group options
        // for (const prop in item) {
        //   if (item.hasOwnProperty(prop) && prop !== 'groupOptions') {
        //     group.groupOriginal[prop] = item[prop];
        //   }
        // }

        data.push(group);
      } else {
        // Option Data
        const y = this.getOptionData(item, optionLabelString, optionValueString);

        if (y) {
          dataType = 'options';
          data.push(y);
        }
      }
    }

    if (dataType === 'groups') {
      return {dataType, groups: data};
    }

    if (dataType === 'options') {
      return {dataType, options: data};
    }
  }

  static getOptionData(obj, labelProp, valueProp): SelectOptionData {
    const label = this.getValueByStringPath(obj, labelProp);
    const value = this.getValueByStringPath(obj, valueProp);

    return (label && value) ? {label, value, original: obj} : null;
  }

  static getGroupData(obj, labelProp, optionsProp): SelectGroupData {
    const label = this.getValueByStringPath(obj, labelProp);
    const options = this.getValueByStringPath(obj, optionsProp);

    return (label && options && Array.isArray(options)) ? {label, options, original: obj} : null;
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

  static getValueByStringPath(o, s) {
    if (!s) {
      return;
    }

    let strPath = '';

    for (let i = 0; i < s.length; i++) {
      strPath += s[i] === '[' || s[i] === ']' ? '.' : s[i];
    }

    const splitPath = strPath.split('.');

    for (let i = 0; i < splitPath.length; ++i) {
      const k = splitPath[i];

      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }

    return o;
  }
}
