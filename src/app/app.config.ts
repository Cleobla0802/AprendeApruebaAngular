import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase } from '@angular/fire/database';
import { provideAuth } from '@angular/fire/auth';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "aprendeaprueba-667c6", appId: "1:210746317476:web:9a2f6b7e8ee84b1fdba431", databaseURL: "https://aprendeaprueba-667c6-default-rtdb.firebaseio.com", storageBucket: "aprendeaprueba-667c6.firebasestorage.app", apiKey: "AIzaSyDCpqkTWcKCzI6OsAgNXGTxgDyNh8YZRk8", authDomain: "aprendeaprueba-667c6.firebaseapp.com", messagingSenderId: "210746317476", measurementId: "G-YZ9R7DRQ9P"})), provideAuth(() => getAuth()), provideDatabase(() => getDatabase())]
};

