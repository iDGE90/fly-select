import {Injectable} from '@angular/core';
import {SelectGroup, SelectHighlightIndex, SelectOption} from '../models/select-data';
import * as ts from 'tsickle/src/typescript-2.4';
import label = ts.ScriptElementKind.label;

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
}
