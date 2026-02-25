import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HuespedesComponent } from './components/huespedes/huespedes.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { ReservacionesComponent } from './components/reservaciones/reservaciones.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent, children:[
     { path: 'huespedes', component: HuespedesComponent }, 
     { path: 'habitaciones', component: HabitacionesComponent },
     { path: 'reservaciones', component: ReservacionesComponent },
  ]},
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
