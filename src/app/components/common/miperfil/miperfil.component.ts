import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-miperfil',
  templateUrl: './miperfil.component.html',
  styleUrls: ['./miperfil.component.css']
})
export class MiperfilComponent implements OnInit {

  username: string | null = null;
  rolesUsuario: string = '';
  previewImage: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  private cargarDatosUsuario(): void {
    this.username = this.authService.getUsername();
    this.rolesUsuario = this.authService.getRoles().join(', ');

    if (this.username) {
      const fotoGuardada = localStorage.getItem(`foto-${this.username}`);
      if (fotoGuardada) {
        this.previewImage = fotoGuardada;
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || !this.username) return;

    const file = input.files[0];

    // Validación básica elegante
    if (!file.type.startsWith('image/')) {
      Swal.fire('Archivo inválido', 'Solo se permiten imágenes.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
      localStorage.setItem(`foto-${this.username}`, this.previewImage);

      Swal.fire('Actualizado', 'Foto actualizada correctamente', 'success');
    };

    reader.readAsDataURL(file);
  }

  guardarCambios(): void {
    Swal.fire({
      icon: 'success',
      title: 'Perfil actualizado',
      text: 'Los cambios se guardaron correctamente.',
      timer: 1500,
      showConfirmButton: false
    });
  }

}