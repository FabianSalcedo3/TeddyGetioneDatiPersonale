import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from '../../models/person.interface';
import { PersonService } from '../../services/person.service';
import Swal from 'sweetalert2';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  people: Person[] = [];
  filteredPeople: Person[] = [];
  filter = '';
  sortField: keyof Person = 'lastName';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedPersonId: number | null = null;
  isLoading = false;
  searchPersonMobile: boolean = false;

  constructor(
    private personService: PersonService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.loadPeople();
    this.personService.getLastEditedId().pipe(takeUntil(this.destroy$)).subscribe(id => {
      if (id !== null) {
        this.selectedPersonId = id;
      }
    })
  }

  loadPeople(): void {
    // this.isLoading = true;
    this.personService.getPeople().subscribe({
      next: (data) => {
        this.people = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        // Swal.fire({
        //   title: 'Errore',
        //   text: 'Impossibile caricare i dati. Riprovare più tardi.',
        //   icon: 'error',
        //   confirmButtonText: 'Riprova',
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     // this.loadPersons();
        //   }
        // });
      }
    });
  }

  // Questo algoritmo consente di filtrare i dati in base al campo di ricerca con la particolarità di essere scalabile (funziona anche con campi aggiuntivi)
  applyFilter(): void {
    this.filteredPeople = this.people.filter(person => {
      if (this.filter.trim() === '') {
        return true; // Non applico filtri se il campo di ricerca è vuoto
      } else {
        for (const key in person) {
          const value = person[key as keyof Person]?.toString().toLowerCase().trim();
          const filterValue = this.filter.toLowerCase().trim();
          if (value && value.includes(filterValue)) {
            return true;
          }
        }
      }
      return false; // Nessun campo corrisponde al filtro
    });
    this.sortData();
  }

  sortData(): void {
    this.filteredPeople.sort((a, b) => {
      const aValue = (a[this.sortField] || '').toString().toLowerCase();
      const bValue = (b[this.sortField] || '').toString().toLowerCase();
      if (aValue === bValue) return 0;
      const comparison = aValue < bValue ? -1 : 1;
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  sort(field: keyof Person): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.sortData();
  }

  onEdit(person: Person): void {
    this.router.navigate(['/edit', person.id]);
  }

  onDelete(person: Person): void {
    Swal.fire({
      title: 'Sei sicuro?',
      text: `Vuoi eliminare ${person.firstName} ${person.lastName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sì, elimina',
      cancelButtonText: 'No, annulla',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed && person.id) {
        this.isLoading = true;
        this.personService.deletePerson(person.id).subscribe({
          next: () => {
            this.isLoading = false;
            this.loadPeople();
            Swal.fire('Eliminato!', 'Il record è stato eliminato.', 'success');
          },
          error: (error) => {
            this.isLoading = false;
            Swal.fire('Errore', 'Impossibile eliminare il record.', 'error');
          }
        });
      }
    });
  }

  onNew(): void {
    this.router.navigate(['/new']);
  }
}
