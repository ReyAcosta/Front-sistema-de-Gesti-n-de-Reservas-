import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { habitacionCambioEstado, HabitacionRequest, HabitacionResponse } from '../../models/habitaciones.model';
import { HabitacionesService } from '../../services/habitaciones.service';
import { TipoHabitacion, TipoHabitacionDescripcion } from '../../constants/TipoHabitacion';
import { EstadoHabitacion, EstadoHabitacionDescripcion } from '../../constants/EstadoHabitacion';
import { registerLocaleData } from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-habitaciones',
  standalone: false,
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css']
})
export class HabitacionesComponent implements OnInit, AfterViewInit {
  listaHabitaciones: HabitacionResponse[] = [];

  isEditMode = false;
  selectedHabitacion: HabitacionResponse | null = null;
  showActions: boolean = false;
  modalText = 'Registrar Habitación';

  @ViewChild('habitacionModalRef')
  habitacionModalEl!: ElementRef;
  habitacionForm: FormGroup;
  private modalInstance!: any;


  @ViewChild("EstadoHabitacionModalRef")
  EstadoHabitacionModalRef!: ElementRef;
  EstadoHabitacionForm: FormGroup;
  private estadoHabitacionModal!: any;

  // private habitacionModal!: any;

  tiposHabitacion: { id: number; descripcion: string }[] = [];
  EstadosHabitacion: { id: number; descripcion: string }[] = [];



  constructor(
    private fb: FormBuilder,
    private habitacionService: HabitacionesService
  ) {

    this.habitacionForm = this.fb.group({
      id: [null],
      numeroHabitacion: [null, [Validators.required, Validators.min(1)]],
      idTipoHabitacion: [null, [Validators.required, Validators.min(1), Validators.max(3)]],
      precio: [null, Validators.required],
      capacidad: [null, [Validators.required, Validators.min(1), Validators.max(6)]],
      // idEstadoHabitacion: [null, Validators.required]
    });

    this.EstadoHabitacionForm = this.fb.group({
      id: [null],
      idEstadoHabitacion: [null, Validators.required]

    })
  }

  ngOnInit(): void {
    this.listarHabitaciones();
    this.cargarTiposHabitacion();
    this.cargarEstadosHabitacion();
  }

  cargarTiposHabitacion() {
    this.tiposHabitacion = Object.values(TipoHabitacion)
      .filter(value => typeof value === 'number')
      .map((value) => ({
        id: value,
        descripcion: TipoHabitacionDescripcion[value]
      }));
  }
  cargarEstadosHabitacion() {
    this.EstadosHabitacion = Object.values(EstadoHabitacion)
      .filter(value => typeof value === 'number')
      .map((value) => ({
        id: value,
        descripcion: EstadoHabitacionDescripcion[value]
      }));
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.habitacionModalEl.nativeElement, { keyboard: false });
    this.estadoHabitacionModal = new bootstrap.Modal(this.EstadoHabitacionModalRef.nativeElement, { keyboard: false });

    this.habitacionModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });

    this.EstadoHabitacionModalRef.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });


  }

  listarHabitaciones(): void {
    this.habitacionService.getHabitaciones().subscribe({
      next: resp => {
        this.listaHabitaciones = resp;
      }
    });
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedHabitacion = null;
    this.habitacionForm.reset();
  }

  toggleForm(): void {
    this.resetForm();
    this.modalText = 'Registrar Habitación';
    this.modalInstance.show();
  }

  editHabitacion(habitacion: HabitacionResponse): void {
    this.isEditMode = true;
    this.selectedHabitacion = habitacion;

    this.modalText = 'Editando Habitación: ' + habitacion.numeroHabitacion;

    this.habitacionForm.patchValue({
      id: habitacion.id,
      numeroHabitacion: habitacion.numeroHabitacion,
      precio: habitacion.precio,
      capacidad: habitacion.capacidad,
      // idEstadoHabitacion: this.convertirDesdeDescripcion(habitacion.estadoHabitacion, EstadoHabitacionDescripcion),
      idTipoHabitacion: this.convertirDesdeDescripcion(habitacion.tipoHabitacion, TipoHabitacionDescripcion),


    });

    this.modalInstance.show();
  }


  onSubmit(): void {

    if (this.habitacionForm.invalid) return;

    const habitacionData: HabitacionRequest = this.habitacionForm.value;

    if (this.isEditMode && this.selectedHabitacion) {
      this.habitacionService.putHabitacion(habitacionData, this.selectedHabitacion.id)
        .subscribe({
          next: registro => {
            const index: number = this.listaHabitaciones.findIndex(hb => hb.id == this.selectedHabitacion!.id);
            if (index !== -1) this.listaHabitaciones[index] = registro;
            Swal.fire('Actualizado', 'Habitacion actualizado correctamente', 'success');
            this.modalInstance.hide();
          }
        });
    } else {
      this.habitacionService.postHabitacion(habitacionData).subscribe({
        next: registro => {
          this.listaHabitaciones.push(registro);
          Swal.fire('Registrado', 'Habitacio registrado correctamente', 'success')
          this.modalInstance.hide();
        }
      });
    }

  }
  /*==========================================================================================*/
  editEstadoHabitacion(habitacion: HabitacionResponse): void {
    this.isEditMode = true;
    this.selectedHabitacion = habitacion;

    this.EstadoHabitacionForm.patchValue({
      id: habitacion.id,
      idEstadoHabitacion: this.convertirDesdeDescripcion(habitacion.estadoHabitacion, EstadoHabitacionDescripcion),

    })
    this.estadoHabitacionModal.show();


  }
  onSubmitEstado(): void {
    const habitacionDatos: habitacionCambioEstado = this.EstadoHabitacionForm.value;

    if (this.isEditMode && this.selectedHabitacion) {
      this.habitacionService.patchHabitacion(habitacionDatos, habitacionDatos.id, habitacionDatos.idEstadoHabitacion)
        .subscribe({
          next:
            registro => {
              const index: number = this.listaHabitaciones.findIndex(hb => hb.id == this.selectedHabitacion!.id);
              if (index !== -1) this.listaHabitaciones[index] = registro;
              Swal.fire('Actualizado', 'Habitacion actualizado correctamente', 'success');
              this.estadoHabitacionModal.hide();
            }
        }
        );
    }
  }

  deleteHabitacion(idHabitacion: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'La habitacion será eliminado permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.habitacionService.deleteHabitacion(idHabitacion).subscribe({
          next: () => {
            this.listaHabitaciones = this.listaHabitaciones.filter(hb => hb.id !== idHabitacion);
            Swal.fire('Eliminado', 'Habitacion eliminado correctamente', 'success');
          }
        });
      }
    });
  }

  private convertirDesdeDescripcion(
    descripcion: string,
    mapaDescripcion: { [key: number]: string }
  ): number | null {

    const entry = Object.entries(mapaDescripcion)
      .find(([_, desc]) => desc === descripcion);

    return entry ? Number(entry[0]) : null;
  }
}