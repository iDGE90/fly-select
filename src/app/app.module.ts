import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FlySelectModule} from '../../projects/select/src/lib/fly-select.module';
import {ReactiveFormsModule} from '@angular/forms';
import {OptionsComponent} from './components/options.component';
import {CustomOptionsComponent} from './components/custom-options.component';
import {GroupsComponent} from './components/groups.component';
import {CustomGroupsComponent} from './components/custom-groups.component';
import {StyleOptionsComponent} from './components/style-options.component';

@NgModule({
  declarations: [
    AppComponent,
    OptionsComponent,
    CustomOptionsComponent,
    GroupsComponent,
    CustomGroupsComponent,
    StyleOptionsComponent
  ],
  imports: [
    BrowserModule,
    FlySelectModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
