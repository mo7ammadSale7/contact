import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Edit Contact' : 'Add Contact' }}</h2>
    <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <mat-form-field>
          <input matInput placeholder="Name" formControlName="name">
        </mat-form-field>

        <mat-form-field>
          <input matInput placeholder="Phone" formControlName="phone">
        </mat-form-field>

        <mat-form-field>
          <input matInput placeholder="Address" formControlName="address">
        </mat-form-field>

        <mat-form-field>
          <textarea matInput placeholder="Notes" formControlName="notes"></textarea>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions>
        <button mat-button type="button" (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="contactForm.invalid">
          {{ data ? 'Update' : 'Add' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 10px;
    }
    mat-dialog-actions {
      justify-content: flex-end;
    }
  `]
})
export class ContactDialogComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Contact | null
  ) {
    this.contactForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      phone: [data?.phone || '', Validators.required],
      address: [data?.address || '', Validators.required],
      notes: [data?.notes || '']
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.dialogRef.close(this.contactForm.value);
    }
  }
}
