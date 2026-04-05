import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApunteService {

  private apiImgBB = 'https://api.imgbb.com/1/upload';
  private apiKeyImgBB = 'c7a45042cb4b545d896d5c8730252add';

  // URL de tu Backend en Railway (Asegúrate de que termine en /api/apuntes)
  // Ejemplo: 'https://mi-backend-production.up.railway.app/api/apuntes'
  private apiBackend = 'https://api-aprende-aprueba-production.up.railway.app/api/apuntes';

  constructor(private http: HttpClient) { }

  subirAImgBB(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.apiImgBB}?key=${this.apiKeyImgBB}`, formData);
  }

  digitalizarEnBackend(titulo: string, url: string, userId: string, categoria: string): Observable<any> {
    const body = { titulo, url, userId, categoria };
    // Importante: Railway usa HTTPS, así que la URL de arriba debe empezar por https://
    return this.http.post(`${this.apiBackend}/digitalizar`, body, { responseType: 'text' as 'json' }); 
  }

  listarApuntesPorUsuario(uid: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBackend}/usuario/${uid}`);
  }

  eliminarApunte(id: any): Observable<any> {
    return this.http.delete(`${this.apiBackend}/${id}`);
  }

  listarApuntes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiBackend);
  }
}