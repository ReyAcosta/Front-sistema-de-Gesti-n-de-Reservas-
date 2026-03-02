import { NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from "./app-routing.module";

import { NavbarComponent } from "./components/common/navbar/navbar.component";
import { FooterComponent } from "./components/common/footer/footer.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { HuespedesComponent } from "./components/huespedes/huespedes.component";
import { AppComponent } from "./app.component";
import { HabitacionesComponent } from "./components/habitaciones/habitaciones.component";
import { FormsModule } from "@angular/forms";
import { ReservacionesComponent } from "./components/reservaciones/reservaciones.component";
import { ErrorInterceptor } from "./shared/error.interceptor";
import { UsuariosComponent } from "./components/usuarios/usuarios.component";
import { LoginComponent } from "./components/login/login.component";
import { AuthInterceptor } from "./shared/auth.interceptor";
import { ReservaeliminadoComponent } from "./components/reservaeliminadas/reservaeliminado/reservaeliminado.component";
@NgModule({
  declarations: [
    AppComponent,
    HuespedesComponent,
    HabitacionesComponent,
    NavbarComponent,
    FooterComponent,
    DashboardComponent,
    ReservaeliminadoComponent,
    ReservacionesComponent,
    LoginComponent,
    UsuariosComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }