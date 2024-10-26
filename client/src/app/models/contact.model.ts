export interface Contact {
  _id?: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
  lockedBy?: string;
}

export interface ContactsResponse {
  contacts: Contact[];
  total: number;
}
