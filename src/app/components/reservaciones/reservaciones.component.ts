import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadoReserva } from '../../constants/EstadoReserva';
import { DatePipe } from '@angular/common';
import { ReservacionRequest, ReservacionResponse } from '../../models/reservaciones.model';
import Swal from 'sweetalert2';
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

  isEditMode: boolean = false;
  selectedReservacion: ReservacionResponse | null = null;
  showActions: boolean = false;
  modalText: string = "Generar Reservacion"

  @ViewChild('reservacionModalRef')
  reservacionModalEl!: ElementRef;
  reservacionForm: FormGroup;

  private modalIntance!: any;

  constructor(private fb: FormBuilder, private reservacionService: ReservacionesService) {
    this.reservacionForm = this.fb.group({
      id: [null],
      idHuesped: [null, [Validators.required, Validators.min(1)]],
      idHabitacion: [null, [Validators.required, Validators.min(1)]],
      fechaInicio: [null, [Validators.required]],
      fechaFin: [null, [Validators.required]],
    })
  }


  ngOnInit(): void {
    this.listarReservaciones();
  }
  ngAfterViewInit(): void {
    this.modalIntance = new bootstrap.Modal(this.reservacionModalEl.nativeElement, { keyboard: false });
    this.reservacionModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    })
  }


  listarReservaciones(): void {
    this.reservacionService.getReservaciones().subscribe({
      next: resp => {
        console.info("Lista de pacientes ", resp)
        this.listaReservaciones = resp;
      }
    })
  }

  onSubmit(): void {
    //validamos que objeto del form venga valido
    if (this.reservacionForm.invalid) return;
    //pasamos a una constante la informacion del objeto del form
    const reservacioData: ReservacionRequest = this.reservacionForm.value;
    //si edit mode is true y eciste una reservacion seleccionada es actualizar si no es registrar
    if (this.isEditMode && this.selectedReservacion) {
      this.reservacionService.putReservacion(reservacioData, this.selectedReservacion.id).subscribe({
        next: registro => {
          const index: number = this.listaReservaciones.findIndex(r => r.id === this.selectedReservacion!.id);
          if (index !== -1) this.listaReservaciones[index] = registro;
          Swal.fire('Actualizado', 'Reservacion actualizado correctamente', 'success')
          this.modalIntance.hide();
        }
      })
    } else {
      this.reservacionService.postReservacion(reservacioData).subscribe({
        next: registro => {
          this.listaReservaciones.push(registro);
          Swal.fire('Registrada', 'La reservacion ha sido registrada', 'success')
          this.modalIntance.hide();
        }
      })
    }
  }


  deleteReservacion(idPaciente: number): void {
    Swal.fire({
      title: 'Esta seguro?',
      text: 'La reservacion se eliminara permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.reservacionService.deleteReservacion(idPaciente).subscribe({
          next: () => {
            this.listaReservaciones = this.listaReservaciones.filter(r => r.id !== idPaciente);
            Swal.fire('Eliminada', 'Reservacion eliminada correctamente', "success");
          }
        })
      }
    })
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedReservacion = null;
    this.reservacionForm.reset()
  }

  toggleForm(): void {
    this.reservacionForm.reset();
    this.modalText = 'Agregar Reservacion';
    this.modalIntance.show();
  }

  editReservacion(reservacion: ReservacionResponse): void {
    this.isEditMode = true;
    this.selectedReservacion = reservacion;
    this.modalText = 'Editando Reservacion: ' + reservacion.id

    this.reservacionForm.patchValue({ ...reservacion })
    this.modalIntance.show();
  }
}

