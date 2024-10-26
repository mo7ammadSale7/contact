import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Contact } from '../../../models/contact.model';
import { ContactService } from '../../../services/contact.service';
import { AuthService } from '../../../services/auth.service';
import { WebsocketService } from '../../../services/websocket.service';
import { ContactDialogComponent } from '../contact-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  totalContacts = 0;
  currentPage = 0;
  displayedColumns = ['name', 'phone', 'address', 'notes', 'actions'];
  filterForm: FormGroup;
  currentUser: string | null = null;
  private subscriptions: Subscription[] = [];
  private dialogRef: any = null;

  constructor(
    private contactService: ContactService,
    private authService: AuthService,
    private websocketService: WebsocketService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      name: [''],
      phone: ['']
    });
  }

  ngOnInit() {
    this.loadContacts();
    this.authService.currentUser$.subscribe(user => this.currentUser = user);

    this.subscriptions.push(
      this.filterForm.valueChanges.subscribe(() => {
        this.currentPage = 0;
        this.loadContacts();
      }),

      this.websocketService.onContactsUpdated().subscribe(() => {
        this.loadContacts();
      }),

      this.websocketService.onContactLocked().subscribe(({ contactId, username }) => {
        console.log(`Contact ${contactId} locked by ${username}`);
        const contact = this.contacts.find(c => c._id === contactId);
        if (contact) {
          contact.lockedBy = username;
        }
      }),

      this.websocketService.onContactUnlocked().subscribe(({ contactId }) => {
        const contact = this.contacts.find(c => c._id === contactId);
        if (contact) {
          contact.lockedBy = undefined;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  loadContacts() {
    const filters = this.filterForm.value;
    this.contactService.getContacts(this.currentPage, 5, filters)
      .subscribe(response => {
        this.contacts = response.contacts;
        this.totalContacts = response.total;
      });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.loadContacts();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(ContactDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactService.addContact(result).subscribe(() => {
          this.loadContacts();
        });
      }
    });
  }

  openEditDialog(contact: Contact) {
    console.log(contact)
    this.contactService.lockContact(contact._id!).subscribe(() => {
      this.dialogRef = this.dialog.open(ContactDialogComponent, {
        width: '400px',
        data: contact,
        disableClose: true
      });

      this.dialogRef.afterClosed().subscribe((result: any) => {
        this.contactService.unlockContact(contact._id!).subscribe();
        if (result) {
          this.contactService.updateContact(contact._id!, result).subscribe(() => {
            this.loadContacts();
          });
        }
        this.dialogRef = null;
      });
    });
  }

  deleteContact(contact: Contact) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: `Are you sure you want to delete ${contact.name}?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactService.deleteContact(contact._id!).subscribe(() => {
          this.loadContacts();
        });
      }
    });
  }
}
