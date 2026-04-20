import { Injectable } from '@angular/core';
import { child, Database, equalTo, get, onValue, orderByChild, query, ref, remove, update } from '@angular/fire/database';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PruebasService {

constructor(private db: Database) {}

  listarTestsPorUsuario(uid: string): Observable<any[]> {
    return new Observable(observer => {
      const testsRef = ref(this.db, 'tests');
      // Filtramos por userId dentro de la carpeta 'tests'
      const testsQuery = query(testsRef, orderByChild('userId'), equalTo(uid));
      
      onValue(testsQuery, (snapshot) => {
        const data = snapshot.val();
        const tests = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
        observer.next(tests);
      });
    });
  }

  eliminarTest(id: string): Observable<void> {
    const testRef = ref(this.db, `tests/${id}`);
    return new Observable(observer => {
      remove(testRef).then(() => {
        observer.next();
        observer.complete();
      });
    });
  }

  obtenerTestPorId(id: string): Observable<any> {
    const dbRef = ref(this.db);
    // 'from' convierte la promesa de Firebase en un Observable
    return from(get(child(dbRef, `tests/${id}`)).then(snapshot => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.error("No existe el test con ese ID en la DB");
        return null;
      }
    }));
  }

  guardarNota(id: string, nota: number) {
    const testRef = ref(this.db, `tests/${id}`);
    // Usamos update para no borrar el resto de datos del test
    return from(update(testRef, { calificacion: nota.toFixed(1) }));
  }

}
