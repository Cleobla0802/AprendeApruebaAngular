import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Database, equalTo, get, listVal, objectVal, orderByChild, push, query, ref, remove, set, update } from '@angular/fire/database';
import { from, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumenesService {

  private apiUrl = environment.api.resumenes;

  constructor(private db: Database, private http: HttpClient) {}

  listarResumenesPorUsuario(uid: string): Observable<any[]> {
    const dbRef = ref(this.db, 'resumenes');
    const queryRef = query(dbRef, orderByChild('userId'), equalTo(uid));
    return listVal(queryRef, { keyField: 'id' });
  }

  eliminarResumen(uid: string, id: string): Observable<void> {
    const dbRef = ref(this.db, `resumenes/${id}`);
    return from(remove(dbRef));
  }

  guardarResumen(resumen: any): Observable<any> {
    const resumenesRef = ref(this.db, 'resumenes');
    return from(push(resumenesRef, resumen));
  }

  actualizarContenidoResumen(id: string, resumenTexto: string, estado: 'generando' | 'listo' | 'error' = 'listo'): Observable<void> {
    const resumenRef = ref(this.db, `resumenes/${id}`);
    return from(get(resumenRef).then(snapshot => {
      if (!snapshot.exists()) return Promise.reject(new Error('El resumen no existe'));
      return update(resumenRef, { resumenTexto, estado });
    }));
  }

  getResumenById(resumenId: string): Observable<any> {
    const resumenRef = ref(this.db, `resumenes/${resumenId}`); 
    return objectVal(resumenRef, { keyField: 'id' });
  }

  actualizarResumen(resumenId: string, datos: any): Observable<void> {
    const resumenRef = ref(this.db, `resumenes/${resumenId}`);
    return from(update(resumenRef, datos));
  }

  guardarResumenEnFirebase(resumen: any): Observable<any> {
    const resumenesRef = ref(this.db, 'resumenes');
    return from(push(resumenesRef, resumen));
  }

  generarConIA(contenido: string): Observable<{ resumen: string }> {
    return this.http.post<{ resumen: string }>(`${this.apiUrl}/generar`, { contenido });
  }
}
