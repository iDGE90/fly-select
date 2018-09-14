import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectComponent} from './components/select/select.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SelectItemBodyDirective} from './directives/select-item-body.directive';
import {SelectGroupBodyDirective} from './directives/select-group-body.directive';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule
  ],
  declarations: [
    SelectComponent,
    SelectItemBodyDirective,
    SelectGroupBodyDirective
  ],
  exports: [
    SelectComponent,
    SelectItemBodyDirective,
    SelectGroupBodyDirective
  ]
})
export class FlySelectModule {
}
