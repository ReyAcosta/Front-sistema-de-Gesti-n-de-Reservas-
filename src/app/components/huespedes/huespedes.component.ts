import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HuespedesService } from '../services/huespedes.service';
import { Observable, of } from 'rxjs';
import { HuespedRequest, HuespedResponse } from '../models/huesped.model';


declare var bootstrap: any;

@Component({
  selector: 'app-huespedes',
  standalone: false,
  templateUrl: './huespedes.component.html',
  styleUrls: ['./huespedes.component.css']
})
export class HuespedesComponent implements OnInit, AfterViewInit {

  listaHuespedes: HuespedResponse[] = [];

  isEditMode: boolean = false;
  selectedHuesped: HuespedResponse | null = null;
  showActions: boolean = false;
  modalText: string = 'Registrar Huesped';

  @ViewChild('huespedModalRef')
  huespedModalEl!: ElementRef;
  huespedForm: FormGroup;

  private modalInstance!: any;

  constructor(
    private fb: FormBuilder,
    private huespedService: HuespedesService
  ) {

    this.huespedForm = this.fb.group({
    id: [null],
    nombre: ['', Validators.required, Validators.maxLength(50), Validators.minLength(1)],
    apellidoPaterno: ['', Validators.required, Validators.maxLength(50), Validators.minLength(1)],
    apellidoMaterno: ['', Validators.required, Validators.maxLength(50), Validators.minLength(1)],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100), Validators.minLength(1), Validators.email]],
    telefono: ['', [Validators.required, Validators.maxLength(10)]],
    idDocumento: [null, Validators.required, Validators.min(1), Validators.max(6)],
    idNacionalidad: [null, Validators.required, Validators.min(1), Validators.max(6)] 
    });
  }

  ngOnInit(): void {
    this.listarHuespedes();
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.huespedModalEl.nativeElement, {keyboard: false});
    this.huespedModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });
  }

  listarHuespedes(): void {
    this.huespedService.getHuespedes().subscribe({
      next: resp => {
        this.listaHuespedes = resp;
      }
    });
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedHuesped = null;
    this.huespedForm.reset();
  }

  toggleForm(): void {
    this.resetForm();
    this.modalText = 'Registrar Huesped';
    this.modalInstance.show();
  }

  editHuesped(huesped: HuespedResponse): void {
    this.isEditMode = true;
    this.selectedHuesped = huesped;
    this.modalText = 'Editando Huesped: ' + huesped.nombre;

    this.huespedForm.patchValue({ ...huesped });
    this.modalInstance.show();
  }

 onSubmit(): void {

  if (this.huespedForm.invalid) return;

  const huespedData: HuespedRequest = this.huespedForm.value;

  if (this.isEditMode && this.selectedHuesped) {
    //Actualizando
    this.huespedService.putHuesped(huespedData, this.selectedHuesped.id).subscribe({
        next: registro => {
          const index: number = this.listaHuespedes.findIndex(h => h.id == this.selectedHuesped!.id);
           if(index !== -1) this.listaHuespedes[index] = registro;
          Swal.fire('Actualizado', 'Huesped actualizado correctamente', 'success');
          this.modalInstance.hide();
        }
      });

  } else {

    this.huespedService.postHuesped(huespedData).subscribe({
        next: registro => {
          this.listaHuespedes.push(registro);
          Swal.fire('Registrado', 'Huesped registrado correctamente', 'success') 
          this.modalInstance.hide();
        }
      });
  }
}

  deleteHuesped(idHuesped: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El huesped será eliminado permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if(result.isConfirmed) {
        this.huespedService.deleteHuesped(idHuesped).subscribe({
          next: () => {
            this.listaHuespedes = this.listaHuespedes.filter(h => h.id !== idHuesped);
            Swal.fire('Eliminado', 'Huesped eliminado correctamente', 'success');
          }
        });
      }
    });
  }
}