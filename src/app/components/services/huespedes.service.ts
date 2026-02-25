import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HuespedRequest, HuespedResponse } from '../models/huesped.model';

@Injectable({
  providedIn: 'root'
})
export class HuespedesService {

  private listaHuespedes: HuespedResponse[] = []; 

  getHuespedes(): Observable<HuespedResponse[]> {
    return of(this.listaHuespedes);
  }
  getHuespedById(id: number): HuespedResponse | undefined {
  return this.listaHuespedes.find(h => h.id === id);
}
  postHuesped(data: HuespedRequest): Observable<HuespedResponse> {
    const nuevo: HuespedResponse = {
    id: new Date().getTime(),
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    tipoDocumento: data.idDocumento.toString(), 
    nacionalidad: data.idNacionalidad.toString() 
    };

    this.listaHuespedes.push(nuevo);

    return of(nuevo);
   
  }

  putHuesped(data: HuespedRequest, id: number): Observable<HuespedResponse> {

  const index = this.listaHuespedes.findIndex(h => h.id === id);

  const actualizado: HuespedResponse = {
    id: id,
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    tipoDocumento: data.idDocumento.toString(),
    nacionalidad: data.idNacionalidad.toString()
  };

  if (index !== -1) {
    this.listaHuespedes[index] = actualizado;
  }

  return of(actualizado);
  }

  deleteHuesped(id: number): Observable<void> {

    this.listaHuespedes =
      this.listaHuespedes.filter(h => h.id !== id);

    return of();
  }
}