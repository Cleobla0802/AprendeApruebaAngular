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

  // Subir la foto a ImgBB
  subirAImgBB(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    // Enviamos a la API de ImgBB
    return this.http.post(`${this.apiImgBB}?key=${this.apiKeyImgBB}`, formData);
  }

  // Enviar la URL al Backend de Java
  digitalizarEnBackend(titulo: string, urlImagen: string): Observable<string> {
    const body = { titulo, url: urlImagen };
    return this.http.post(this.apiBackend + '/digitalizar', body, { responseType: 'text' });
  }


  listarApuntes(): Observable<Apunte[]> {
    return this.http.get<Apunte[]>(this.apiBackend + '/listar');
  }
}