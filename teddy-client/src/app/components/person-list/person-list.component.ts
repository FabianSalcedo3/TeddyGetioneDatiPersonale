import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Person } from '../../models/person.interface';
import { PersonService } from '../../services/person.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {
  people: Person[] = [];
  filteredPersons: Person[] = [];
  filters = {
    firstName: '',
    lastName: '',
    city: '',
    email: ''
  };
  sortField: keyof Person = 'lastName';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedPersonId: number | null = null;
  isLoading = false;
  searchPersonMobile: boolean = false;

  constructor(
    private personService: PersonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPersons();
    this.personService.selectedPerson$.subscribe(person => {
      if (person) {
        this.selectedPersonId = person.id || null;
        this.scrollToSelectedPerson();
      }
    });
  }

  loadPersons(): void {
    // this.isLoading = true;
    this.personService.getPersons().subscribe({
      next: (data) => {
        this.people = data;
        this.applyFilters();
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

  applyFilters(): void {
    this.filteredPersons = this.people.filter(person => {
      return (!this.filters.firstName || person.firstName.toLowerCase().includes(this.filters.firstName.toLowerCase())) &&
        (!this.filters.lastName || person.lastName.toLowerCase().includes(this.filters.lastName.toLowerCase())) &&
        (!this.filters.city || person.city?.toLowerCase().includes(this.filters.city.toLowerCase())) &&
        (!this.filters.email || person.email.toLowerCase().includes(this.filters.email.toLowerCase()));
    });
    this.sortData();
  }

  sortData(): void {
    this.filteredPersons.sort((a, b) => {
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
            this.loadPersons();
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

  private scrollToSelectedPerson(): void {
    const selectedRow = document.querySelector('.table-info');
    if (selectedRow) {
      selectedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
