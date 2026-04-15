export interface Pregunta {
  id: number;
  enunciado: string;
  opciones: string[];     // Array de strings con las posibles respuestas
  respuestaCorrecta: number; // El índice (0, 1, 2...) de la opción correcta
  explicacion?: string;   // Opcional: por qué esa es la correcta (útil para aprender)
}

export interface Test {
  id?: string;            // ID de Firebase
  userId: string;         // ID del dueño del test
  titulo: string;
  categoria: string;      // matematicas, ciencias, etc.
  fecha: number;          // Timestamp para ordenar por fecha
  preguntas: Pregunta[];  // Array con los objetos de tipo Pregunta
  
  // Metadatos de rendimiento (opcionales)
  completado?: boolean;
  ultimaNota?: number;    // Porcentaje de aciertos (0-100)
}