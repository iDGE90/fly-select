import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-custom-groups',
  template: `
    <form [formGroup]="form">
      <fly-select
          [data]="groups"
          labelProperty="name"
          valueProperty="id"
          groupLabelProperty="universe"
          groupOptionsProperty="heroes"
          [formControlName]="'select'"
          (selected)="handleSelected($event)">
        <ng-template let-group="group" flySelectGroupBody>
          <div class="universe-card">
            <div class="image" [style.backgroundImage]="'url(' + group.groupOriginal.avatar + ')'"></div>

            <div class="info">{{group.groupOriginal.universe}}</div>
          </div>
        </ng-template>

        <ng-template let-option="option" flySelectItemBody>
          <div class="hero-card">
            <div class="image" [style.backgroundImage]="'url(' + option.original.avatar + ')'"></div>

            <div class="info">
              <div class="alias">{{option.original.alias}}</div>
              <div class="name-company">{{option.original.name}}, {{option.original.company}}</div>
            </div>
          </div>
        </ng-template>
      </fly-select>
    </form>
  `
})
export class CustomGroupsComponent {
  groups = [
    {
      universe: 'Marvel',
      avatar: 'https://cdn3.iconfinder.com/data/icons/movie-company/129/MARVEL.png',
      heroes: [
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
        }
      ]
    },
    {
      universe: 'DC',
      avatar: 'https://cdn3.iconfinder.com/data/icons/movie-company/129/DC.png',
      heroes: [
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
      ]
    }
  ];

  form = new FormGroup({
    select: new FormControl('', Validators.required)
  });

  constructor() {
  }

  handleSelected(e) {
    console.log('Custom groups component: ', e);
  }
}
