import { Component, ElementRef, ViewChild } from '@angular/core';
import { UsuarioRequest, UsuarioResponse } from '../../models/Usuarios.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { RoleDescriptions, Roles } from '../../constants/Roles';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-usuarios',
  standalone: false,
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

  usuarios: UsuarioResponse[] = [];
  usuarioForm: FormGroup;
  textoModal: string = 'Registrar Usuario';
  muestraAcciones: boolean = false;
  roles: string[] = Object.values(Roles);

  @ViewChild('usuarioModalRef') usuarioModalEl!: ElementRef;
  private modalInstance!: any;

  constructor(
    private usuariosService: UsuariosService, 
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.usuarioForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      roles: [[], [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.listarUsuarios();
    if(this.authService.hasRole(Roles.ADMIN)) {
      this.muestraAcciones = true;
    }
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.usuarioModalEl.nativeElement, { keyboard: false });
    this.usuarioModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    });
  }

  listarUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: resp => {
        this.usuarios = resp;
      },
      error: (error) => {
        console.error('Error al listar usuarios:', error);
        Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
      }
    });
  }

  transformarRol(rol: string): string {
    return RoleDescriptions[rol as Roles] || 'Desconocido';
  }

  toggleForm(): void {
    this.resetForm();
    this.textoModal = 'Registrar Usuario';
    this.modalInstance.show();
  }

  resetForm(): void {
    this.usuarioForm.reset();
    this.usuarioForm.get('roles')?.setValue([]);
  }

  onSubmit(): void {
    if (this.usuarioForm.invalid) return;

    const usuarioData: UsuarioRequest = this.usuarioForm.value;

    this.usuariosService.postUsuario(usuarioData).subscribe({
      next: newUsuario => {
        this.usuarios.push(newUsuario);
        Swal.fire('Registrado', 'Usuario registrado correctamente', 'success');
        this.modalInstance.hide();
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        Swal.fire('Error', 'No se pudo registrar el usuario', 'error');
      }
    });
  }

  deleteUsuario(username: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `El usuario "${username}" será eliminado permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.usuariosService.deleteUsuario(username).subscribe({
          next: () => {
            this.usuarios = this.usuarios.filter(u => u.username !== username);
            Swal.fire('Eliminado', `Usuario "${username}" eliminado correctamente`, 'success');
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
            Swal.fire('Error', 'No se pudo eliminar el usuario', 'error');
          }
        });
      }
    });
  }

}
