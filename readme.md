# Address Book Application

A responsive, single-page web application that allows users to manage a list of contacts. This project is built using vanilla web technologies and demonstrates asynchronous JavaScript concepts, DOM manipulation, and interaction with a mock REST API.

## 🚀 Features

* **CRUD Operations:** Add, Edit, and Delete contacts from the address book.
* **Duplicate Prevention:** Validates entries to ensure no duplicate names or phone numbers are added to the address book.
* **Smart Search:** Real-time filtering to search for a person by their Name or City.
* **Sorting:** Sort the contact list dynamically by Name, City, or State.
* **Modern UI:** Clean, responsive design based on modern XD wireframes.
* **Asynchronous Logic:** Uses ES6 features and AJAX Promises (`fetch`) to interact seamlessly with the backend.

## 🛠️ Technology Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6 Modules)
* **API Calls:** AJAX Promises using the Native Fetch API
* **Backend / Database:** `json-server` (Mock REST API using a `db.json` file)

## 📂 Project Structure

\`\`\`text
address-book/
├── index.html          # Main HTML structure and modal UI
├── css/
│   └── style.css       # Application styling
├── js/
│   ├── api.js          # Handles all AJAX Promises (GET, POST, PUT, DELETE)
│   └── app.js          # Core application logic, event listeners, and DOM updates
├── package.json        # Node dependencies and scripts
├── db.json             # Mock database file
└── README.md           # Project documentation
\`\`\`

## ⚙️ Prerequisites

To run this project locally, you will need to have **Node.js** installed on your machine. 
* [Download Node.js here](https://nodejs.org/)

## 💻 Installation & Setup

**1. Clone the repository**
\`\`\`bash
git clone <your-repository-url>
cd address-book
\`\`\`

**2. Install dependencies**
Install `json-server` to mock the backend database:
\`\`\`bash
npm install
\`\`\`

**3. Start the JSON Server**
Run the following command to start the local database. It will watch the `db.json` file and run on port 3000.
\`\`\`bash
npm run server
\`\`\`
*(Keep this terminal window open while using the app)*

**4. Serve the Frontend Application**
Because this project uses ES6 Modules (`<script type="module">`), you must open the `index.html` file via a local web server to avoid CORS errors.
* **Using VS Code:** Install the "Live Server" extension, right-click `index.html`, and select "Open with Live Server".
* **Using Python:** Run `python -m http.server 5500` in a new terminal window and navigate to `http://localhost:5500` in your browser.

## 🧠 Core Logic Highlights

* **Duplicate Validation:** Before a `POST` or `PUT` request is made, the application cross-references the input data against the current state to prevent duplicates (ignoring the ID of the contact currently being edited).
* **State Management:** The application maintains a local array of contacts fetched from the server. Sorting and searching filter this local array before dynamically injecting the resulting HTML template string into the DOM.
* **Separation of Concerns:** Network requests are isolated in `api.js`, keeping the main controller (`app.js`) clean and focused solely on DOM updates and user events.