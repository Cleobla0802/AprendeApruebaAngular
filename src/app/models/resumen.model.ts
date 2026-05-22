export interface Resumen {
  id?: string;
  titulo: string;
  descripcion?: string;
  resumenTexto: string;
  categoria: string;
  fecha: number;
  userId: string;
  idApunteOriginal?: string;
  contenidoHash?: string;
  estado?: 'generando' | 'listo' | 'error';
}
