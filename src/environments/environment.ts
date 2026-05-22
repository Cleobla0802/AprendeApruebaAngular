export const environment = {
  production: false,
  firebase: {
    projectId: 'aprendeaprueba-667c6',
    appId: '1:210746317476:web:9a2f6b7e8ee84b1fdba431',
    databaseURL: 'https://aprendeaprueba-667c6-default-rtdb.firebaseio.com',
    storageBucket: 'aprendeaprueba-667c6.firebasestorage.app',
    apiKey: 'AIzaSyDCpqkTWcKCzI6OsAgNXGTxgDyNh8YZRk8',
    authDomain: 'aprendeaprueba-667c6.firebaseapp.com',
    messagingSenderId: '210746317476',
    measurementId: 'G-YZ9R7DRQ9P'
  },
  api: {
    baseUrl: 'https://api-aprende-aprueba-1.onrender.com/api',
    apuntes: 'https://api-aprende-aprueba-1.onrender.com/api/apuntes',
    resumenes: 'https://api-aprende-aprueba-1.onrender.com/api/resumenes',
    testsGenerar: 'https://api-aprende-aprueba-1.onrender.com/api/tests/generar'
  },
  ia: {
    limiteResumen: 8000,
    limiteTest: 7000
  }
};
