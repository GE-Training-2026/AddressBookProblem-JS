const API_URL = 'http://localhost:3000/contacts';

export class AddressBookAPI {
    // GET all contacts
    static getContacts() {
        return fetch(API_URL).then(res => res.json());
    }

    // POST a new contact
    static addContact(contact) {
        return fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        }).then(res => res.json());
    }

    // PUT (Update) an existing contact
    static updateContact(id, contact) {
        return fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        }).then(res => res.json());
    }

    // DELETE a contact
    static deleteContact(id) {
        return fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        }).then(res => res.json());
    }
}