import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// components
import { HomeComponent } from './Components/home/home.component';
import { AsteroidsComponent } from './Components/asteroids/asteroids.component'


const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'asteroids', component: AsteroidsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
