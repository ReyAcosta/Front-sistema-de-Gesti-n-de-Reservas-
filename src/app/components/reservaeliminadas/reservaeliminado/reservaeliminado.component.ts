import { Component } from '@angular/core';
import { ReservacionResponse } from '../../../models/reservaciones.model';
import { ReservacionesService } from '../../../services/reservaciones.service';

@Component({
  selector: 'app-reservaeliminado',
  standalone: false,
  templateUrl: './reservaeliminado.component.html',
  styleUrl: './reservaeliminado.component.css'
})
export class ReservaeliminadoComponent {

  listaReservaciones: ReservacionResponse[] = [];

  constructor(private reservacionService: ReservacionesService) { }

  ngOnInit(): void {
    this.cargarEliminadas();
  }

  cargarEliminadas(): void {
    this.reservacionService.getReservacionesEliminadas()
      .subscribe({
        next: resp => this.listaReservaciones = resp,
        error: err => {
          if (err.status === 403) {
            alert("No tienes permisos para ver esta información");
          }
        }
      });
  }
}