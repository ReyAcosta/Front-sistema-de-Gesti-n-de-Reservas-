import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadoReserva, obtenerIdPorDescripcion } from '../../constants/EstadoReserva';
import { DatePipe } from '@angular/common';
import { ReservacionRequest, ReservacionResponse } from '../../models/reservaciones.model';
import Swal from 'sweetalert2';
import { ReservacionesService } from '../../services/reservaciones.service';
import { HuespedesService } from '../../services/huespedes.service';
import { HabitacionesService } from '../../services/habitaciones.service';
import { HuespedResponse } from '../../models/huesped.model';
import { HabitacionResponse } from '../../models/habitaciones.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';


declare var bootstrap: any;

@Component({
    selector: 'app-reservaciones',
    standalone: false,
    templateUrl: './reservaciones.component.html',
    styleUrls: ['./reservaciones.component.css']
})
export class ReservacionesComponent implements OnInit, AfterViewInit {

    listaReservaciones: ReservacionResponse[] = [];
    listaHuespedes: HuespedResponse[] = [];
    listaHabitaciones: HabitacionResponse[] = [];
    estadosReserva = Object.entries(EstadoReserva).
        filter(([key, value]) => isNaN(Number(key)));

    isEditMode: boolean = false;
    selectedReservacion: ReservacionResponse | null = null;
    showActions: boolean = false;
    modalText: string = "Generar Reservacion"

    @ViewChild('reservacionModalRef')
    reservacionModalEl!: ElementRef;
    reservacionForm: FormGroup;

    private modalIntance!: any;

    @ViewChild('editarEstadoModalRef')
    editarEstadoModalEl!: ElementRef;
    estadoForm: FormGroup;

    private modalIntanceEditar!: any;


    constructor(private fb: FormBuilder, private reservacionService: ReservacionesService,
        private huespedService: HuespedesService, private habitacionService: HabitacionesService,
        public authService:AuthService, private router: Router
    ) {
        this.reservacionForm = this.fb.group({
            id: [null],
            idHuesped: [null, [Validators.required, Validators.min(1)]],
            idHabitacion: [null, [Validators.required, Validators.min(1)]],
            fechaInicio: [null, [Validators.required]],
            fechaFin: [null, [Validators.required]],
        }),
            this.estadoForm = this.fb.group({
                idEstado: [null]
            })
    }


    ngOnInit(): void {
        this.listarReservaciones();
        this.listarHabitaciones();
        this.listarHuespedes();
    }
    ngAfterViewInit(): void {
        this.modalIntance = new bootstrap.Modal(this.reservacionModalEl.nativeElement, { keyboard: false });
        this.reservacionModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
            this.resetForm();
        })

        this.modalIntanceEditar = new bootstrap.Modal(this.editarEstadoModalEl.nativeElement, { keyboard: false });
        this.editarEstadoModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
            this.resetForm();
        })
    }


    listarReservaciones(): void {
        this.reservacionService.getReservaciones().subscribe({
            next: resp => {
                console.info("Lista de Reservaciones: ", resp)
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

    updateEstado(): void {
        this.reservacionService.updateEstado(this.selectedReservacion!.id, this.estadoForm.value.idEstado)
            .subscribe({
                next: resgitro => {
                    const index: number = this.listaReservaciones.findIndex(r => r.id === this.selectedReservacion!.id);
                    if (index !== -1) this.listaReservaciones[index] = resgitro;
                    Swal.fire('Actualizado', 'Estado de reservacion actualizado correctamente', 'success')
                    this.modalIntanceEditar.hide();
                }
            })
    }

    listarHuespedes(): void {
        this.huespedService.getHuespedes().subscribe({
            next: resp => {
                this.listaHuespedes = resp;
            }
        })
    }

    listarHabitaciones(): void {
        this.habitacionService.getHabitaciones().subscribe({
            next: resp => {
                this.listaHabitaciones = resp;
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



        this.reservacionForm.patchValue({
            ...reservacion,
            idHuesped: reservacion.huesped.id,
            idHabitacion: reservacion.habitacion.id
        })
        this.modalIntance.show();
    }

    editEstadoReserva(reservacion: ReservacionResponse): void {
        this.selectedReservacion = reservacion;
        this.estadoForm.patchValue({
            idEstado: obtenerIdPorDescripcion(reservacion.estadoReserva)
        })


        this.modalIntanceEditar.show();
        console.log(this.estadosReserva)
    }
    irAEliminadas(): void {
    this.router.navigate(['/admin/eliminadas']);
}
}

