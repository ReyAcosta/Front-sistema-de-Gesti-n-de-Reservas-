import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { Observable, of } from 'rxjs';
import { HuespedRequest, HuespedResponse } from '../../models/huesped.model';
import { HuespedesService } from '../../services/huespedes.service';



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
    this.modalInstance = new bootstrap.Modal(this.huespedModalEl.nativeElement);
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

    const data: HuespedRequest = this.huespedForm.value;

    if (this.isEditMode && this.selectedHuesped) {
      (document.activeElement as HTMLElement)?.blur();
      this.huespedService.putHuesped(data, this.selectedHuesped.id)
        .subscribe({
          next: () => {
            this.listarHuespedes();
            this.modalInstance.hide();
          }
        });

    } else {

      this.huespedService.postHuesped(data)
        .subscribe({
          next: () => {
            this.listarHuespedes();
            this.modalInstance.hide();
          }
        });
    }
  }

  deleteHuesped(id: number): Observable<void> {

    const index = this.listaHuespedes.findIndex(h => h.id === id);

    if (index !== -1) {
      this.listaHuespedes.splice(index, 1);
    }

    return of();
  }

}