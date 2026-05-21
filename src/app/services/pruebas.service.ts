import { Injectable } from '@angular/core';
import { child, Database, equalTo, get, listVal, objectVal, onValue, orderByChild, push, query, ref, remove, set, update } from '@angular/fire/database';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PruebasService {

constructor(private db: Database) {}

  listarTestsPorUsuario(uid: string): Observable<any[]> {
    const testsRef = ref(this.db, 'tests');
    const testsQuery = query(testsRef, orderByChild('userId'), equalTo(uid));
    return listVal(testsQuery, { keyField: 'id' });
  }

  obtenerTestPorId(id: string): Observable<any> {
    const testRef = ref(this.db, `tests/${id}`);
    return objectVal(testRef, { keyField: 'id' });
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

  guardarNota(id: string, nota: number) {
    const testRef = ref(this.db, `tests/${id}`);
    return from(update(testRef, { calificacion: nota.toFixed(1) }));
  }

  crearTest(test: any): Observable<any> {
    const testsRef = ref(this.db, 'tests');
    const nuevoTestRef = push(testsRef);
    const id = nuevoTestRef.key;

    return from(set(nuevoTestRef, test).then(() => {
      return { ...test, id: id };
    }));
  }

  actualizarPreguntasTest(id: string, preguntas: any[], estado: 'generando' | 'listo' | 'error' = 'listo'): Observable<void> {
    const testRef = ref(this.db, `tests/${id}`);
    return from(get(testRef).then(snapshot => {
      if (!snapshot.exists()) return;
      return update(testRef, { preguntas, estado });
    }));
  }

}
