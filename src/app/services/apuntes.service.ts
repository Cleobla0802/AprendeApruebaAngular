import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apunte } from '../models/apunte.model';

@Injectable({
  providedIn: 'root'
})
export class ApunteService {

  private apiImgBB = 'https://api.imgbb.com/1/upload';
  private apiBackend = 'http://localhost:8080/api/apuntes'; // Proyecto backend parte de apuntes
  private apiKeyImgBB = 'c7a45042cb4b545d896d5c8730252add'; // Api key de el servicio de hosting para sacar una URL de el archivo proporcionado por el usuario

constructor(private http: HttpClient) { }

  /**
   * 1. Subir la imagen a ImgBB
   */
  subirAImgBB(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.apiImgBB}?key=${this.apiKeyImgBB}`, formData);
  }

  /**
   * 2. Enviar datos al Backend para que la IA digitalice y guarde
   */
  digitalizarEnBackend(titulo: string, url: string, userId: string, categoria: string): Observable<any> {
  const body = { titulo, url, userId, categoria };
  return this.http.post(`${this.apiBackend}/digitalizar`, body, { responseType: 'text' as 'json' }); 
  // Ese 'responseType' hará que Angular acepte el texto sin intentar parsearlo a JSON
}

  /**
   * 3. Listar apuntes filtrados por usuario (Privacidad)
   */
  listarApuntesPorUsuario(uid: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBackend}/usuario/${uid}`);
  }

  /**
   * 4. Eliminar un apunte
   */
  eliminarApunte(id: any): Observable<any> {
    return this.http.delete(`${this.apiBackend}/${id}`);
  }

  /**
   * 5. Listado general (si aún lo usas)
   */
  listarApuntes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiBackend);
  }
}