# JsonPowerDB Web Applications

This repository contains two web applications built for the **Login2Xplore** assignment using HTML, CSS (Bootstrap 5), JavaScript, and the **JsonPowerDB (JPDB)** REST API. It demonstrates fully functional CRUD operations directly from the frontend.

## 📂 Project Structure
- **[Employee-Form](./Employee-Form)**: Practice assignment for managing Employee data (Salary, HRA, DA, etc.).
- **[Student-Enrollment-Form](./Student-Enrollment-Form)**: Final Micro-Project for managing Student data (Roll No, Class, DOB, etc.).

## 🚀 Features
- **Create (Save)**: Add new records to the JPDB database.
- **Read (Fetch)**: Fetch existing records automatically when Primary Key (Employee ID / Roll No) is entered.
- **Update (Change)**: Modify existing records dynamically.
- **Modern UI**: Built with Bootstrap 5 and customized Glassmorphism CSS styling.
- **Form Validations**: Built-in visual invalid-feedback for empty fields.
- **UX Polish**: Spinners on buttons while saving/updating, Auto-calculated Net Salary, and Toast Alerts for success/error states.

## 🛠️ Technology Stack
- **Frontend**: HTML5, CSS3, Bootstrap 5
- **JavaScript**: ES6 (let/const), jQuery
- **Database**: JsonPowerDB (JPDB) via `jpdb-commons.js`

## ⚙️ Setup & How to Run
1. Clone this repository to your local machine.
2. Open the `script.js` file inside the respective project folder.
3. Replace the placeholder token with your actual **Connection Token** from the Login2Xplore Developer Dashboard (if needed, it is currently preset).
   ```javascript
   const connToken = "YOUR_CONNECTION_TOKEN";
   ```
4. Double click `index.html` to run the project in any modern browser.

> 🔒 **Security Note**: In a production environment, Connection Tokens should be handled securely on a backend server. In this project, the token is exposed client-side purely for educational/demo purposes, as per JsonPowerDB's client-side integration architecture for this assignment.
