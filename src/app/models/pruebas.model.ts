export interface Pregunta {
  id?: number;
  enunciado: string;
  opciones: string[];
  respuestaCorrecta: number;
  explicacion?: string;
}

export interface Test {
  id?: string;
  userId: string;
  titulo: string;
  descripcion?: string;
  categoria: string;
  fecha: number;
  preguntas: Pregunta[];
  estado?: 'generando' | 'listo' | 'error';
  cantidadPreguntas?: number;
  materialId?: string;
  materialTipo?: 'apuntes' | 'resumenes';
  contenidoHash?: string;
  completado?: boolean;
  ultimaNota?: number;
  calificacion?: number;
}
