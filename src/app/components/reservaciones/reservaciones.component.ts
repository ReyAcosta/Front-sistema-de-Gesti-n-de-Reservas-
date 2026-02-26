import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadoReserva } from '../../constants/EstadoReserva';
import { DatePipe } from '@angular/common';
import { ReservacionRequest, ReservacionResponse } from '../../models/reservaciones.model';

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
  modalText: string = 'Registrar Paciente';

  @ViewChild('reservacionModalRef')
  reservacionModalEl!: ElementRef;
  reservacionForm: FormGroup;

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }
}