import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Database, listVal, ref, remove } from '@angular/fire/database';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumenesService {

  // Añadimos el protocolo https:// y la ruta base de tu controlador de Java
  private apiUrl = 'https://api-aprende-aprueba-production.up.railway.app/api/resumenes';

  constructor(private db: Database, private http: HttpClient) {}

  /**
   * Obtiene los resúmenes directamente de Firebase (Lectura rápida)
   */
  getResumenesByUser(userId: string): Observable<any[]> {
    const resumenesRef = ref(this.db, `resumenes/${userId}`);
    return listVal(resumenesRef, { keyField: 'id' });
  }

  /**
   * Elimina un resumen directamente de Firebase
   */
  eliminarResumen(userId: string, resumenId: string): Observable<void> {
    const resumenRef = ref(this.db, `resumenes/${userId}/${resumenId}`);
    return from(remove(resumenRef));
  }

  /**
   * 1. Habla con tu Backend en Railway para que Nemotron procese el texto
   */
  generarConIA(contenido: string): Observable<{ resumen: string }> {
    // Enviamos el objeto con la clave "contenido" tal cual lo espera tu controlador en Java
    return this.http.post<{ resumen: string }>(`${this.apiUrl}/generar`, { contenido });
  }

  /**
   * 2. Envía el objeto Resumen completo a tu Backend para que Java lo guarde en Firebase
   */
  guardarResumen(resumen: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/guardar`, resumen);
  }
}
