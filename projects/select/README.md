# Fly Select

Fly select is a simple dropdown select element with minimalistic design and customizable options.

![N|Solid](https://i.imgur.com/o3UhQSr.jpg)

### Simple usage:

Add *FlySelectModule* in imports array in *AppModule*
```ts
import {FlySelectModule} from 'fly-select';
```

Add *fly-select* component in ...component.html
```html
<fly-select
    [data]="data">
</fly-select>
```

Add the *data* array in ...component.ts
```js
const data = [
    {
        label: 'Tony Stark',
        value: 'ironman'
    },
    {
        label: 'Bruce Wayne',
        value: 'batman'
    },
    {
        label: 'Clark Kent',
        value: 'superman'
    }
];
```

### Custom Options Template:
```html
<fly-select
    [data]="data">
    <ng-template let-option="option" flySelectItemBody>
        <div class="hero-card">
            <div class="image" [style.backgroundImage]="'url(' + option.original.avatar + ')'"></div>
        
            <div class="info">
                <div class="alias">{{option.original.alias}}</div>
                <div class="name-copmany">{{option.original.name}}, {{option.original.company}}</div>
            </div>
        </div>
    </ng-template>
</fly-select>
```

```js
const data = [
    {
        id: 1,
        name: 'Tony Stark',
        alias: 'Ironman',
        company: 'Stark Industries',
        avatar: 'https://cdn0.iconfinder.com/data/icons/superhero-2/256/Ironman-512.png'
    },
    {
        id: 2,
        name: 'Bruce Wayne',
        alias: 'Batman',
        company: 'Wayne Enterprises',
        avatar: 'https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Batman-512.png'
    },
    {
        id: 3,
        name: 'Clark Kent',
        alias: 'Superman',
        company: 'Daily Planet',
        avatar: 'https://cdn0.iconfinder.com/data/icons/superhero-2/256/Superman-512.png'
    }
];
```

### Groups Custom Template:
```html
<form [formGroup]="formOne">
    <fly-select
      (selected)="handleSelect($event)"
      [data]="groups"
      [labelProperty]="'name'"
      [valueProperty]="'id'"
      [formControlName]="'select'">
        <ng-template let-group="group" flySelectGroupBody>
            <div class="universe-card">
                <div class="image" [style.backgroundImage]="'url(' + group.groupOriginal.avatar + ')'"></div>
                
                <div class="info">{{group.groupLabel}}</div>
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
```

```js
 groups = [
    {
      groupLabel: 'Marvel',
      avatar: 'https://cdn3.iconfinder.com/data/icons/movie-company/129/MARVEL.png',
      groupOptions: [
        {
          id: 1,
          name: 'Tony Stark',
          alias: 'Ironman',
          gender: 'Male',
          company: 'Stark Industries',
          avatar: 'https://cdn0.iconfinder.com/data/icons/superhero-2/256/Ironman-512.png'
        },
        ...
      ]
    },
    ...
];
```

### Keyboard events

> Keyboard events available for esc, enter, arrowup, arrowdown

### Reactive Forms

You can also use it with reactive forms.

```js
form = new FormGroup({
    hero: new FormControl('', [Validators.required])
});
```

```html
<fly-select
    [data]="data"
    [formControlName]="'hero'">
</fly-select>
```

If you want to set a default value, lets say you want Superman to be selected on component init:

```js
ngOnInit() {
  this.form.get('hero').setValue(this.data[2]);
}
```

### Inputs

| Input | Type | Description |
| ------ | ------  | ------ |
| placeholder | string | Custom text to show when no option is selected |
| labelProperty | string | Property to get that label from |
| valueProperty | string | Property to get that value from |


### Outputs

| Output | Type | Description |
| ------ | ------ | ------ |
| selected | EventEmitter | Option is selected |

### Directives

| Directive Name |  Description |
| ------ | ------ |
| flySelectGroupBody | Use it for customizing the groups template |
| flySelectItemBody | Use it for customizing the options template |