import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HuespedesComponent } from './components/huespedes/huespedes.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HabitacionesComponent } from './components/habitaciones/habitaciones.component';
import { ReservacionesComponent } from './components/reservaciones/reservaciones.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guards';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { Roles } from './constants/Roles';
import { ReservaeliminadoComponent } from './components/reservaeliminadas/reservaeliminado/reservaeliminado.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'huespedes', pathMatch: 'full' },
      { path: 'huespedes', component: HuespedesComponent },
      { path: 'habitaciones', component: HabitacionesComponent },
      {
        path: 'reservaciones', component: ReservacionesComponent, children: [
          { path: 'reservaeliminado', component: ReservaeliminadoComponent }]
      },
      {
        path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard], data: { roles: [Roles.ADMIN] }
      }
    ]
  },

  { path: '**', redirectTo: 'dashboard' }

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
