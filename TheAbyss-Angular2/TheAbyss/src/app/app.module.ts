import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DeComponent } from './component/de.component';
import { AccountComponent } from './component/account.component';
import { DaicoComponent } from './component/daico.component';
import { PageNotFoundComponent } from './component/pagenotfound.component';

const appRoutes: Routes = [
  {
    path: 'home',
    component: DeComponent,
    data: { title: 'The abyss home' }
  },
  {
    path: 'account',
    component: AccountComponent,
    data: { title: 'The abyss account' }
  },
  {
    path: 'daico',
    component: DaicoComponent,
    data: { title: 'The abyss daico' }
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'index',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    DeComponent,
    AccountComponent,
    DaicoComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
