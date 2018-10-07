import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-options',
  template: `
    <form [formGroup]="form">
      <fly-select
          [data]="options"
          labelProperty="alias"
          valueProperty="id"
          [placeholder]="'Select Hero'"
          [formControlName]="'select'"
          (selected)="handleSelected($event)">
      </fly-select>
    </form>
  `
})
export class OptionsComponent {
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
    console.log('Default options component: ', e);
  }
}
