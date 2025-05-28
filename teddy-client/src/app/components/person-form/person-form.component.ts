import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../../services/person.service';
import { Person } from '../../models/person.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {
  personForm: FormGroup;
  isEditing = false;
  personId: number | null = null;
  isLoading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.personForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      address: [''],
      locality: [''],
      city: [''],
      province: ['', [Validators.maxLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.personId = +id;
      this.loadPerson(this.personId);
    }
  }

  loadPerson(id: number): void {
    this.isLoading = true;
    this.personService.getPerson(id).subscribe({
      next: (person) => {
        this.personForm.patchValue(person);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore nel caricamento della persona:', error);
        this.isLoading = false;
        Swal.fire({
          title: 'Errore',
          text: 'Impossibile caricare i dati. Riprovare più tardi.',
          icon: 'error',
          confirmButtonText: 'Torna alla lista'
        }).then(() => {
          this.router.navigate(['/']);
        });
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.personForm.valid) {
      this.isLoading = true;
      const personData: Person = this.personForm.value;

      const saveOperation = this.isEditing && this.personId
        ? this.personService.updatePerson(this.personId, personData)
        : this.personService.createPerson(personData);

      saveOperation.subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire({
            title: 'Successo',
            text: `Record ${this.isEditing ? 'aggiornato' : 'creato'} con successo!`,
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/']);
          });
        },
        error: (error) => {
          this.isLoading = false;
          Swal.fire({
            title: 'Errore',
            text: `Impossibile ${this.isEditing ? 'aggiornare' : 'creare'} il record.`,
            icon: 'error'
          });
        }
      });
    } else {
      Object.keys(this.personForm.controls).forEach(key => {
        const control = this.personForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  onCancel(): void {
    Swal.fire({
      title: 'Sei sicuro?',
      text: 'Le modifiche non salvate andranno perse.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sì, abbandona',
      cancelButtonText: 'No, continua'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/']);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.personForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) return 'Campo obbligatorio';
      if (control.errors['email']) return 'Email non valida';
      if (control.errors['minlength']) return `Minimo ${control.errors['minlength'].requiredLength} caratteri`;
      if (control.errors['maxlength']) return `Massimo ${control.errors['maxlength'].requiredLength} caratteri`;
    }
    return '';
  }
}
