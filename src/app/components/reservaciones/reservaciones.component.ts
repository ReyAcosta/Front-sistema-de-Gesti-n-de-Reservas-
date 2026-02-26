import {  AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReservacionRequest, ReservacionResponse } from '../models/reservaciones.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadoReserva } from '../../constants/EstadoReserva';
import { DatePipe } from '@angular/common';
import { ReservacionesService } from '../services/reservaciones.service';
import Swal from 'sweetalert2';

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
      idReservacion: [null, Validators.required],
      idHabitacion: [null, Validators.required],
      fechaReserva:[null, Validators.required],
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
      idReservacion: null, 
      idHabitacion: null,
      fechaInicio: reservacion.fechaInicio,
      idEstadoReserva: reservacion.estadoReserva
    });

    this.modalInstance.show();
  }

  onSubmit(): void {

    if (this.reservacionForm.invalid) return;

    const reservacionData: ReservacionRequest = this.reservacionForm.value;

    if (this.isEditMode && this.selectedReservacion) {
       this.reservacionService.putReservacion(reservacionData, this.selectedReservacion.id).subscribe({
              next: registro => {
                const index: number = this.listaReservaciones.findIndex(r => r.id == this.selectedReservacion!.id);
                 if(index !== -1) this.listaReservaciones[index] = registro;
                Swal.fire('Actualizado', 'Huesped actualizado correctamente', 'success');
                this.modalInstance.hide();
              }
            });
      

    } else {
       this.reservacionService.postReservacion(reservacionData).subscribe({
              next: registro => {
                this.listaReservaciones.push(registro);
                Swal.fire('Actualizado', 'Huesped actualizado correctamente', 'success');
                this.modalInstance.hide();
              }
            });

      
    }
  }

 
  deleteReservacion(idReservacion: number): void {
  Swal.fire({
      title: '¿Estás seguro?',
      text: 'El huesped será eliminado permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if(result.isConfirmed) {
        this.reservacionService.deleteReservacion(idReservacion).subscribe({
          next: () => {
            this.listaReservaciones = this.listaReservaciones.filter(r => r.id !== idReservacion);
            Swal.fire('Eliminado', 'Huesped eliminado correctamente', 'success');
          }
        });
      }
    });
  }
}