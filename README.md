# Aprende & Aprueba

## Descripcion de Aprende & Aprueba

Aplicación diseñada para facilitar y optimizar el proceso de estudio de los estudiantes mediante la digitalización de apuntes. La plataforma permite subir y organizar contenidos académicos para generar automáticamente resúmenes y pruebas de autoevaluación, favoreciendo un aprendizaje más eficaz y personalizado. Además, incorpora un sistema de gestión de objetivos que ayuda a planificar y hacer seguimiento de metas académicas, como la preparación de exámenes o entregas, de forma sencilla, ágil y centralizada.

## Estructura de los componentes

componentes:
  - presentacion
  - autenticacion
      - Login
      - Sigin
      - recuperar-password
  - Apuntes
      - Crear-apuntes
      - visualizar-apuntes
  - navbar
  - footer

## Justificacion del scss

Hover y Estéticas Específicas

La mayoría de los elementos de la aplicación (aproximadamente un 90%) cuentan con interacciones visuales al pasar el cursor (hover), diseñadas para mejorar la experiencia del usuario y aportar dinamismo a la interfaz.

### Hover y esteticas especificas

Por ejemplo, un efecto típico de hover aplicado a botones o tarjetas se ve así:

:hover {
      transform: translateY(-2px);
      box-shadow: 0 0.5rem 1rem rgba(13, 110, 253, 0.3);
    }

Además de los efectos de interacción, la aplicación incluye elementos estéticos más específicos y personalizados que aportan identidad visual y destacan información importante.

.texto-gradiente{
  background: linear-gradient(to right, #00c1f6, #800080); // azul a morado
  -webkit-text-fill-color: transparent;
  background-clip: text; // Determina el lugar de pintado de fondo
}

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.19.