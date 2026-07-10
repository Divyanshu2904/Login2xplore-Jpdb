# JsonPowerDB Employee Management Form

This is a single-page Employee Management Form built with HTML, CSS (Bootstrap 5), and JavaScript (jQuery) that interacts with **JsonPowerDB (JPDB)** via REST APIs.

## Features
- **Create** new employee records (Employee ID, Name, Salary, HRA, DA, Deduction).
- **Read/Fetch** existing employee details by simply entering the Employee ID and pressing `Tab` (or losing focus).
- **Update** existing employee details using the `Change` button.
- Clean and modern **Glassmorphism UI** utilizing Bootstrap 5.
- Uses `jpdb-commons.js` library for simplified AJAX requests.

## How to Run
1. Clone the repository.
2. Open `script.js` and locate line 8:
   ```javascript
   var connToken = "YOUR_CONNECTION_TOKEN_HERE";
   ```
3. Replace `"YOUR_CONNECTION_TOKEN_HERE"` with your actual Connection Token from the Login2Xplore Developer Dashboard.
4. Open `index.html` in any modern web browser.
5. Enjoy seamless database operations directly from the browser!

## Technology Stack
- **Frontend**: HTML5, CSS3, Bootstrap 5
- **JavaScript**: Vanilla JS, jQuery (for AJAX requests)
- **Database**: JsonPowerDB (JPDB)

## Workflow Example
1. **Enter Employee ID**: Type an ID (e.g., `EMP01`) and press `Tab`.
2. **If ID does not exist**: The form will unlock the remaining fields. You can fill them in and click **Save**.
3. **If ID exists**: The form will fetch the existing data from JPDB and populate the fields. You can modify the details and click **Change**.
4. **Reset**: Use the **Reset** button to clear the form at any time.

## Assignment Details
Designed for the Login2Xplore assignment, following standard practices of utilizing JPDB's API endpoints (`/api/irl` for GET, `/api/iml` for PUT/UPDATE) alongside the provided `jpdb-commons.js` helper library.
