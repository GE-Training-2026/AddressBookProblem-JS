import { AddressBookAPI } from './api.js';

class AddressBookApp {
    constructor() {
        this.contacts = []; // Local state
        this.cacheDOM();
        this.bindEvents();
        this.init();
    }

    cacheDOM() {
        this.contactList = document.getElementById('contactList');
        this.searchInput = document.getElementById('searchInput');
        this.sortSelect = document.getElementById('sortSelect');
        this.addBtn = document.getElementById('addBtn');
        this.modal = document.getElementById('contactModal');
        this.form = document.getElementById('contactForm');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.modalTitle = document.getElementById('modalTitle');
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.openModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.searchInput.addEventListener('input', () => this.render());
        this.sortSelect.addEventListener('change', () => this.render());

        // Event delegation for Edit and Delete buttons
        this.contactList.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn')) {
                this.editContact(e.target.dataset.id);
            } else if (e.target.classList.contains('delete-btn')) {
                this.deleteContact(e.target.dataset.id);
            }
        });
    }

    // Initialize data
    init() {
        AddressBookAPI.getContacts()
            .then(data => {
                this.contacts = data;
                this.render();
            })
            .catch(err => console.error("Failed to fetch data:", err));
    }

    // Handle duplicate validation
    isDuplicate(name, phone, currentId = null) {
        return this.contacts.some(contact => {
            // Check if name OR phone already exists, ignoring the current editing contact
            const isMatch = (contact.name.toLowerCase() === name.toLowerCase() || contact.phone === phone);
            return isMatch && String(contact.id) !== String(currentId);
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const id = document.getElementById('contactId').value;
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value.trim();

        // 1. Duplicate Check
        if (this.isDuplicate(name, phone, id)) {
            alert('A contact with this Name or Phone Number already exists!');
            return;
        }

        const contactData = { name, phone, city, state };

        // 2. Add or Update using AJAX Promises
        if (id) {
            AddressBookAPI.updateContact(id, contactData).then(() => {
                this.closeModal();
                this.init(); // Refresh data
            });
        } else {
            AddressBookAPI.addContact(contactData).then(() => {
                // If user wants to add multiple, we could keep the modal open and just reset the form here.
                // For now, we will close it and refresh.
                this.closeModal();
                this.init();
            });
        }
    }

    deleteContact(id) {
        if (confirm('Are you sure you want to delete this contact?')) {
            AddressBookAPI.deleteContact(id).then(() => {
                this.init();
            });
        }
    }

    editContact(id) {
        const contact = this.contacts.find(c => String(c.id) === String(id));
        if (contact) {
            document.getElementById('contactId').value = contact.id;
            document.getElementById('name').value = contact.name;
            document.getElementById('phone').value = contact.phone;
            document.getElementById('city').value = contact.city;
            document.getElementById('state').value = contact.state;
            this.openModal(true);
        }
    }

    // Process Sort & Search, then render HTML
    render() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const sortBy = this.sortSelect.value;

        // Search Filter
        let filteredContacts = this.contacts.filter(c =>
            c.name.toLowerCase().includes(searchTerm) ||
            c.city.toLowerCase().includes(searchTerm)
        );

        // Sort Data
        filteredContacts.sort((a, b) => {
            if (a[sortBy].toLowerCase() < b[sortBy].toLowerCase()) return -1;
            if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
            return 0;
        });

        // Generate HTML with Template Literals
        this.contactList.innerHTML = filteredContacts.map(contact => `
            <tr>
                <td>${contact.name}</td>
                <td>${contact.phone}</td>
                <td>${contact.city}</td>
                <td>${contact.state}</td>
                <td>
                    <button class="btn secondary edit-btn" data-id="${contact.id}">Edit</button>
                    <button class="btn danger delete-btn" data-id="${contact.id}">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    openModal(isEdit = false) {
        this.modalTitle.textContent = isEdit ? 'Edit Person' : 'Add Person';
        this.modal.classList.remove('hidden');
    }

    closeModal() {
        this.form.reset();
        document.getElementById('contactId').value = '';
        this.modal.classList.add('hidden');
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    new AddressBookApp();
});