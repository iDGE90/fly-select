import {Component, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-style-options',
  template: `
    <form [formGroup]="form">
      <fly-select
          [data]="options"
          [style]="false"
          labelProperty="alias"
          valueProperty="id"
          [placeholder]="'Select Hero'"
          [formControlName]="'select'"
          (selected)="handleSelected($event)">
      </fly-select>
    </form>

    <style>
      fly-select .open .fly-select-head-wrapper {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }

      .fly-select-head-wrapper {
        border-radius: 4px;
      }

      .fly-select-body-wrapper {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        overflow: auto;
      }

      .fly-select-head-wrapper,
      .fly-select-option-wrapper {
        padding: 10px 20px;
        color: #fff;
        background-color: #485761;
      }

      .fly-select-option-wrapper.highlight {
        background-color: #5aaeee;
      }
    </style>
  `,
  encapsulation: ViewEncapsulation.None
})
export class StyleOptionsComponent {
  options = [
    {
      id: 1,
      name: 'Tony Stark',
      alias: 'Ironman',
      gender: 'Male',
      company: 'Stark Industries',
      avatar: 'https://cdn0.iconfinder.com/data/icons/superhero-2/256/Ironman-512.png'
    },
    {
      id: 2,
      name: 'Steve Rogers',
      alias: 'Captain America',
      gender: 'Male',
      company: 'US Army',
      avatar: 'https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Captain-Shield-512.png'
    },
    {
      id: 3,
      name: 'Bruce Wayne',
      alias: 'Batman',
      gender: 'Male',
      company: 'Wayne Enterprises',
      avatar: 'https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Batman-512.png'
    },
    {
      id: 4,
      name: 'Clark Kent',
      alias: 'Superman',
      gender: 'Male',
      company: 'Daily Planet',
      avatar: 'https://cdn0.iconfinder.com/data/icons/superhero-2/256/Superman-512.png'
    }
  ];

  form = new FormGroup({
    select: new FormControl('', Validators.required)
  });

  constructor() {
  }

  handleSelected(e) {
    console.log('Styled default options component: ', e);
  }
}
