import { Injectable } from '@angular/core';
import { Database, equalTo, onValue, orderByChild, query, ref, remove } from '@angular/fire/database';
import { Observable } from 'rxjs';

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
  const testRef = ref(this.db, `tests/${id}`);
  return new Observable(observer => {
    onValue(testRef, (snapshot) => {
      observer.next(snapshot.val());
    });
  });
}

}
