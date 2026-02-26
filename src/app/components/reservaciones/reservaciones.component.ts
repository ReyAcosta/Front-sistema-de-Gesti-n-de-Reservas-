import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadoReserva } from '../../constants/EstadoReserva';
import { DatePipe } from '@angular/common';
import { ReservacionRequest, ReservacionResponse } from '../../models/reservaciones.model';
import { ReservacionesService } from '../../services/reservaciones.service';


declare var bootstrap: any;

@Component({
  selector: 'app-reservaciones',
  standalone: false,

  templateUrl: './reservaciones.component.html',
  styleUrls: ['./reservaciones.component.css']
})
export class ReservacionesComponent implements OnInit, AfterViewInit {

  listaReservaciones: ReservacionResponse[] = [];

  isEditMode = false;
  selectedReservacion: ReservacionResponse | null = null;
  modalText = 'Registrar Reservación';

  EstadoReserva = EstadoReserva;

  @ViewChild('reservacionModalRef')
  reservacionModalEl!: ElementRef;

  reservacionForm: FormGroup;
  private modalInstance!: any;

  constructor(
    private fb: FormBuilder,
    private reservacionService: ReservacionesService
  ) {

    this.reservacionForm = this.fb.group({
      idHuesped: [null, Validators.required],
      idHabitacion: [null, Validators.required],
      fechaReserva: [null, Validators.required],
      fechaInicio: [null, Validators.required],
      fechaFin: [null],
      idEstadoReserva: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.listarReservaciones();
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.reservacionModalEl.nativeElement);

    this.reservacionModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });
  }
  listarReservaciones(): void {
    this.reservacionService.getReservaciones().subscribe({
      next: resp => this.listaReservaciones = resp
    });
  }


  resetForm(): void {
    this.isEditMode = false;
    this.selectedReservacion = null;
    this.reservacionForm.reset();
  }

  toggleForm(): void {
    this.resetForm();
    this.modalText = 'Registrar Reservación';
    this.modalInstance.show();
  }


  editReservacion(reservacion: ReservacionResponse): void {

    this.isEditMode = true;
    this.selectedReservacion = reservacion;
    this.modalText = 'Editar Reservación #' + reservacion.id;

    this.reservacionForm.patchValue({
      idHuesped: null,
      idHabitacion: null,
      fechaInicio: reservacion.fechaInicio,
      idEstadoReserva: reservacion.estadoReserva
    });

    this.modalInstance.show();
  }

  onSubmit(): void {

    if (this.reservacionForm.invalid) return;

    const data: ReservacionRequest = this.reservacionForm.value;

    if (this.isEditMode && this.selectedReservacion) {

      this.reservacionService
        .putReservacion(data, this.selectedReservacion.id)
        .subscribe(() => {
          this.listarReservaciones();
          this.modalInstance.hide();
        });

    } else {

      this.reservacionService
        .postReservacion(data)
        .subscribe(() => {
          this.listarReservaciones();
          this.modalInstance.hide();
        });
    }
  }


  deleteReservacion(id: number): void {

    this.reservacionService
      .deleteReservacion(id)
      .subscribe(() => {
        this.listarReservaciones();
      });
  }
}