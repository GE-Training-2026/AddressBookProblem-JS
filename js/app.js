import { AddressBookAPI } from './api.js';

class AddressBookApp {
    constructor() {
        this.contacts = [];
        this.cacheDOM();
        this.bindEvents();
        this.init();
    }

    cacheDOM() {
        // Changed to contactGrid
        this.contactGrid = document.getElementById('contactGrid');
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

        // Event delegation now attached to contactGrid
        this.contactGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn')) {
                this.editContact(e.target.dataset.id);
            } else if (e.target.classList.contains('delete-btn')) {
                this.deleteContact(e.target.dataset.id);
            }
        });
    }

    init() {
        AddressBookAPI.getContacts()
            .then(data => {
                this.contacts = data;
                this.render();
            })
            .catch(err => console.error("Failed to fetch data:", err));
    }

    isDuplicate(name, phone, currentId = null) {
        return this.contacts.some(contact => {
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

        if (this.isDuplicate(name, phone, id)) {
            alert('A contact with this Name or Phone Number already exists!');
            return;
        }

        const contactData = { name, phone, city, state };

        if (id) {
            AddressBookAPI.updateContact(id, contactData).then(() => {
                this.closeModal();
                this.init();
            });
        } else {
            AddressBookAPI.addContact(contactData).then(() => {
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

    // UPDATED RENDER METHOD: Now generates Cards instead of Table Rows
    render() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const sortBy = this.sortSelect.value;

        let filteredContacts = this.contacts.filter(c =>
            c.name.toLowerCase().includes(searchTerm) ||
            c.city.toLowerCase().includes(searchTerm)
        );

        filteredContacts.sort((a, b) => {
            if (a[sortBy].toLowerCase() < b[sortBy].toLowerCase()) return -1;
            if (a[sortBy].toLowerCase() > b[sortBy].toLowerCase()) return 1;
            return 0;
        });

        // Inject Card HTML
        this.contactGrid.innerHTML = filteredContacts.map(contact => `
            <div class="employee-card">
                <div class="employee-header">
                    <div class="employee-name">${contact.name}</div>
                    <div class="employee-role">📞 ${contact.phone}</div>
                </div>
                <div class="employee-details">
                    <span><strong>City:</strong> ${contact.city}</span>
                    <span><strong>State:</strong> ${contact.state}</span>
                </div>
                <div class="employee-actions">
                    <button class="btn secondary edit-btn" data-id="${contact.id}">Edit</button>
                    <button class="btn danger delete-btn" data-id="${contact.id}">Delete</button>
                </div>
            </div>
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

document.addEventListener('DOMContentLoaded', () => {
    new AddressBookApp();
});