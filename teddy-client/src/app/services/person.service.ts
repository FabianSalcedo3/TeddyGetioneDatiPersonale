import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Person } from '../models/person.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  // sarebbe meglio in un .env
  private apiUrl = environment.apiUrl;
  lastEditedId = new BehaviorSubject<number | null>(null);

  constructor(private http: HttpClient) { }

  getPeople(): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.apiUrl}`);
  }

  getPerson(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.apiUrl}person/${id}`);
  }

  createPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(`${this.apiUrl}person`, person).pipe(tap((newPerson: Person) => {
      // Aggiorna l'ID dell'ultima persona modificata
      if (typeof newPerson.id === 'number') {
        this.setLastEditedId(newPerson.id);
      }
    }));
  }

  updatePerson(id: number, person: Person): Observable<Person> {
    return this.http.put<Person>(`${this.apiUrl}person/${id}`, person).pipe(tap((updatedPerson: Person) => {
      // Aggiorna l'ID dell'ultima persona modificata
      if (typeof updatedPerson.id === 'number') {
        this.setLastEditedId(updatedPerson.id);
      }
    }));
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}person/${id}`);
  }

  setLastEditedId(id: number | null): void {
    this.lastEditedId.next(id);
  }
  getLastEditedId(): Observable<number | null> {
    return this.lastEditedId.asObservable();
  }
}
