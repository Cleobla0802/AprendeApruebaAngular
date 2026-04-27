import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Database, equalTo, listVal, objectVal, orderByChild, push, query, ref, remove, set, update } from '@angular/fire/database';
import { Apunte } from '../models/apunte.model';

@Injectable({
  providedIn: 'root'
})
export class ApunteService {

  private apiImgBB = 'https://api.imgbb.com/1/upload';
  private apiKeyImgBB = 'c7a45042cb4b545d896d5c8730252add';

  private apiBackend = 'https://api-aprende-aprueba-1.onrender.com/api/apuntes';

  constructor(private http: HttpClient, private db: Database) { }

  /**
   * FIREBASE: Obtener todos los apuntes del usuario actual
   * (He cambiado el nombre para que coincida con el error de tu componente)
   */
  listarApuntesPorUsuario(userId: string): Observable<Apunte[]> {
    const apuntesRef = ref(this.db, 'apuntes');
    const consulta = query(apuntesRef, orderByChild('userId'), equalTo(userId));
    // keyField: 'id' es vital para que cada objeto traiga su ID de Firebase
    return listVal(consulta, { keyField: 'id' }) as Observable<Apunte[]>;
  }

  guardarApunte(apunte: any): Observable<any> {
    const apuntesRef = ref(this.db, 'apuntes');
    // push crea un nuevo ID único automáticamente en Firebase
    return from(push(apuntesRef, apunte));
  }

  /**
   * FIREBASE: Obtener un solo apunte por su ID
   */
  getApunteById(apunteId: string): Observable<Apunte | null> {
    const apunteRef = ref(this.db, `apuntes/${apunteId}`);
    return objectVal(apunteRef, { keyField: 'id' }) as Observable<Apunte | null>;
  }

  /**
   * FIREBASE: Eliminar un apunte
   */
  eliminarApunte(id: string): Observable<void> {
    const apunteRef = ref(this.db, `apuntes/${id}`);
    return from(remove(apunteRef));
  }

  /**
   * FIREBASE: Actualizar datos de un apunte (sin borrar el resto)
   */
  actualizarApunteFirebase(apunteId: string, datos: Partial<Apunte>): Observable<void> {
    const apunteRef = ref(this.db, `apuntes/${apunteId}`);
    return from(update(apunteRef, datos));
  }

  /**
   * HTTP: Subir imagen a ImgBB para obtener una URL pública
   */
  subirAImgBB(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.apiImgBB}?key=${this.apiKeyImgBB}`, formData);
  }

  /**
   * HTTP: Enviar URL al backend para que la IA extraiga el texto
   */
  digitalizarEnBackend(titulo: string, url: string, userId: string, categoria: string): Observable<any> {
    const body = { titulo, url, userId, categoria };
    // Usamos responseType text porque a veces el backend devuelve el string directo
    return this.http.post(`${this.apiBackend}/digitalizar`, body, { responseType: 'text' as 'json' }); 
  }
}