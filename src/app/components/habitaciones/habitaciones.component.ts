import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HabitacionRequest, HabitacionResponse } from '../models/habitaciones.model';
import { HabitacionesService } from '../services/habitaciones.service';
import { Observable, of } from 'rxjs';


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
  modalText = 'Registrar Habitación';

  @ViewChild('habitacionModalRef')
  habitacionModalEl!: ElementRef;

  habitacionForm: FormGroup;
  private modalInstance!: any;

  constructor(
    private fb: FormBuilder,
    private habitacionService: HabitacionesService
  ) {

    this.habitacionForm = this.fb.group({
      id: [null],
      numeroHabitacion: [null, Validators.required],
      idTipoHabitacion: [null, Validators.required],
      precio: [null, Validators.required],
      capacidad: [null, Validators.required],
      idEstadoHabitacion: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.listarHabitaciones();
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.habitacionModalEl.nativeElement);

    this.habitacionModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
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
      capacidad: habitacion.capacidad
    });

    this.modalInstance.show();
  }

  onSubmit(): void {

    if (this.habitacionForm.invalid) return;

    const data: HabitacionRequest = this.habitacionForm.value;

    if (this.isEditMode && this.selectedHabitacion) {
        (document.activeElement as HTMLElement)?.blur();
      this.habitacionService.putHabitacion(data, this.selectedHabitacion.id)
        .subscribe({
            next: () =>  {
          this.listarHabitaciones();
          this.modalInstance.hide();
            }
        });

    } else {

      this.habitacionService.postHabitacion(data)
        .subscribe({
            next: () => {
          this.listarHabitaciones();
          this.modalInstance.hide();
            }
        });
    }
  }

  deleteHabitacion(id: number): Observable<void> {
    const index = this.listaHabitaciones.findIndex(h => h.id === id);

  if (index !== -1) {
    this.listaHabitaciones.splice(index, 1);
  }
  return of(); 
  }
}