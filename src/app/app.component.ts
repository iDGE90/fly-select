import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  data = [
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
      name: 'Bruce Wayne',
      alias: 'Batman',
      gender: 'Male',
      company: 'Wayne Enterprises',
      avatar: 'https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Batman-512.png'
    },
    {
      id: 3,
      name: 'Clark Kent',
      alias: 'Superman',
      gender: 'Male',
      company: 'Daily Planet',
      avatar: 'https://cdn0.iconfinder.com/data/icons/superhero-2/256/Superman-512.png'
    }
  ];
  select = [
    {
      label: 'Tony Stark',
      value: 1
    },
    {
      label: 'Bruce Wayne',
      value: 2
    },
    {
      label: 'Clark Kent',
      value: 3
    }
  ];

  formOne = new FormGroup({
    select: new FormControl('', [Validators.required])
  });

  formTwo = new FormGroup({
    select: new FormControl('', [Validators.required])
  });

  constructor() {
  }

  ngOnInit() {
    // this.form.get('select').setValue(this.data[1]);
  }

  handleSelect(e) {
    console.log(e);
  }

}
