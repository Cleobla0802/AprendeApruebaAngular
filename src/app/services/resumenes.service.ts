import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Database, equalTo, listVal, objectVal, orderByChild, push, query, ref, remove, set, update } from '@angular/fire/database';
import { from, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumenesService {

  // Añadimos el protocolo https:// y la ruta base de tu controlador de Java
  private apiUrl = 'https://api-aprende-aprueba-1.onrender.com/api/resumenes';

  constructor(private db: Database, private http: HttpClient) {}

  /**
   * FIREBASE: Lista resúmenes filtrados por UID
   */
  listarResumenesPorUsuario(uid: string): Observable<any[]> {
    const dbRef = ref(this.db, 'resumenes');
    const queryRef = query(dbRef, orderByChild('userId'), equalTo(uid));
    return listVal(queryRef, { keyField: 'id' });
  }

  /**
   * FIREBASE: Eliminar resumen
   * Corregido: Ahora acepta el UID como primer argumento para que no te dé error el componente,
   * aunque para borrar en una estructura plana solo necesitemos el ID.
   */
  eliminarResumen(uid: string, id: string): Observable<void> {
    const dbRef = ref(this.db, `resumenes/${id}`);
    return from(remove(dbRef));
  }

  guardarResumen(resumen: any): Observable<any> {
  const resumenesRef = ref(this.db, 'resumenes');
  // push(ref, data) crea un nuevo nodo con un ID único automático
  return from(push(resumenesRef, resumen));
  }

  /**
   * FIREBASE: Obtener un resumen por su ID
   */
  getResumenById(resumenId: string): Observable<any> {
    const resumenRef = ref(this.db, `resumenes/${resumenId}`); 
    return objectVal(resumenRef, { keyField: 'id' });
  }

  /**
   * FIREBASE: Actualizar resumen
   */
  actualizarResumen(resumenId: string, datos: any): Observable<void> {
    const resumenRef = ref(this.db, `resumenes/${resumenId}`);
    // Usamos update en lugar de set para no borrar campos accidentamente
    return from(update(resumenRef, datos));
  }

  /**
   * FIREBASE: Guardar directamente desde Angular (Sin pasar por el Backend)
   * Como quieres hacerlo todo en Angular, este método guarda el objeto en Firebase.
   */
  guardarResumenEnFirebase(resumen: any): Observable<any> {
    const resumenesRef = ref(this.db, 'resumenes');
    // push genera un ID automático en Firebase
    return from(push(resumenesRef, resumen));
  }

  /**
   * IA: Habla con tu Backend en Render para procesar el texto
   */
  generarConIA(contenido: string): Observable<{ resumen: string }> {
    return this.http.post<{ resumen: string }>(`${this.apiUrl}/generar`, { contenido });
  }
}
