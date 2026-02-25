import { NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from "./app-routing.module";

import { NavbarComponent } from "./components/common/navbar/navbar.component";
import { FooterComponent } from "./components/common/footer/footer.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { HuespedesComponent } from "./components/huespedes/huespedes.component";
import { AppComponent } from "./app.component";
import { HabitacionesComponent } from "./components/habitaciones/habitaciones.component";
import { FormsModule } from "@angular/forms";
import { ReservacionesComponent } from "./components/reservaciones/reservaciones.component";

@NgModule({
  declarations: [
    AppComponent,
    HuespedesComponent,
    HabitacionesComponent,
    NavbarComponent,
    FooterComponent,
    DashboardComponent,
    ReservacionesComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}