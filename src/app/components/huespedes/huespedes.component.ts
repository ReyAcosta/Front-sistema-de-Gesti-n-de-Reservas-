import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import { HuespedRequest, HuespedResponse } from '../../models/huesped.model';
import { HuespedesService } from '../../services/huespedes.service';
import { TipoDocumento, TipoDocumentoDescripcion } from '../../constants/TipoDocumento';
import { Nacionalidad, NacionalidadDescripcion } from '../../constants/Nacionalidad';
import { AuthService } from '../../services/auth.service';
import { Roles } from '../../constants/Roles';
import { ActivatedRoute, Router } from '@angular/router';



declare var bootstrap: any;

@Component({
  selector: 'app-huespedes',
  standalone: false,
  templateUrl: './huespedes.component.html',
  styleUrls: ['./huespedes.component.css']
})
export class HuespedesComponent implements OnInit, AfterViewInit {

  listaHuespedes: HuespedResponse[] = [];

  tiposDocumento = Object.values(TipoDocumento).filter
  (v => typeof v === 'number') as TipoDocumento[];
  TipoDocumentoDescripcion = TipoDocumentoDescripcion;

  nacionalidades=Object.values(Nacionalidad).filter(v => typeof v === 'number') as Nacionalidad[];
  NacionalidadDescripcion = NacionalidadDescripcion;

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
    private huespedService: HuespedesService, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.huespedForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      apellidoPaterno: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      apellidoMaterno: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1), Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100), Validators.minLength(1)]],
      telefono: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[0-9]+$/)]],
      idDocumento: [null, [Validators.required, Validators.min(1), Validators.max(6)]],
      idNacionalidad:[null, [Validators.required, Validators.min(1), Validators.max(8)]]
    });
  }

  ngOnInit(): void {
   this.route.data.subscribe(data => {
    if (data['eliminados']) {
      this.listarHuespedesEliminados();
    } else {
      this.listarHuespedes();
    }
  });

  if (this.authService.hasRole(Roles.ADMIN)) {
    this.showActions = true;
  }
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
        console.info("Lista de huespedes: ", resp)
        this.listaHuespedes = resp;
      }
    });
  }
  listarHuespedesEliminados(): void{
    this.huespedService.getHuespedesEliminados().subscribe({
      next: resp => {
        console.info("Lista de huespedes: ", resp)
        this.listaHuespedes = resp;
      }
    })
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
    console.log("Documento recibido:", huesped.tipoDocumento);
    console.log("Nacionalidad recibida:", huesped.nacionalidad);

    this.huespedForm.patchValue({ id: huesped.id,
    nombre: huesped.nombre,
    apellidoPaterno: huesped.apellidoPaterno,
    apellidoMaterno: huesped.apellidoMaterno,
    email: huesped.email,
    telefono: huesped.telefono,

    idDocumento: this.getDocumentoId(huesped.tipoDocumento),
    idNacionalidad: this.getNacionalidadId(huesped.nacionalidad) 
  });
    this.modalInstance.show();
  }
  
  onSubmit(): void {

    if (this.huespedForm.invalid) return;


  const huespedData = this.huespedForm.value;

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
  
  private getDocumentoId(descripcion: string): number | null {
  const entry = Object.entries(this.TipoDocumentoDescripcion)
    .find(([_, value]) =>
      value.trim().toLowerCase() === descripcion.trim().toLowerCase()
    );

  return entry ? Number(entry[0]) : null;
}

private getNacionalidadId(descripcion: string): number | null {
  const entry = Object.entries(this.NacionalidadDescripcion)
    .find(([_, value]) =>
      value.trim().toLowerCase() === descripcion.trim().toLowerCase()
    );

  return entry ? Number(entry[0]) : null;
}
irAEliminadas():void{
  this.listarHuespedesEliminados();
}
}
