import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Database, equalTo, get, listVal, objectVal, orderByChild, push, query, ref, remove, update } from '@angular/fire/database';
import { Apunte } from '../models/apunte.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApunteService {

  private apiBackend = environment.api.apuntes;

  constructor(private http: HttpClient, private db: Database) { }

  listarApuntesPorUsuario(userId: string): Observable<Apunte[]> {
    const apuntesRef = ref(this.db, 'apuntes');
    const consulta = query(apuntesRef, orderByChild('userId'), equalTo(userId));
    return listVal(consulta, { keyField: 'id' }) as Observable<Apunte[]>;
  }

  guardarApunte(apunte: Apunte): Observable<any> {
    const apuntesRef = ref(this.db, 'apuntes');
    return from(push(apuntesRef, apunte));
  }

  getApunteById(apunteId: string): Observable<Apunte | null> {
    const apunteRef = ref(this.db, `apuntes/${apunteId}`);
    return objectVal(apunteRef, { keyField: 'id' }) as Observable<Apunte | null>;
  }

  actualizarContenidoApunte(id: string, contenido: string, estado: 'generando' | 'listo' | 'error' = 'listo'): Observable<void> {
    return this.actualizarApunteFirebase(id, { contenido, estado } as Partial<Apunte>);
  }

  eliminarApunte(id: string): Observable<void> {
    const apunteRef = ref(this.db, `apuntes/${id}`);
    return from(remove(apunteRef));
  }

  actualizarApunteFirebase(apunteId: string, datos: Partial<Apunte>): Observable<void> {
    const apunteRef = ref(this.db, `apuntes/${apunteId}`);
    return from(get(apunteRef).then(snapshot => {
      if (!snapshot.exists()) return;
      return update(apunteRef, datos);
    }));
  }

  digitalizarArchivoEnBackend(file: File, titulo: string, userId: string, categoria: string): Observable<any> {
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('titulo', titulo);
    formData.append('userId', userId);
    formData.append('categoria', categoria);
    return this.http.post(`${this.apiBackend}/digitalizar-archivo`, formData, { responseType: 'text' as 'json' });
  }
}
