# Expense Tracker

A simple full-stack expense tracker built with Node.js, Express, PostgreSQL, HTML, CSS, JavaScript, and Bootstrap.

The application allows users to add, edit, delete, and filter expenses while storing the data in a PostgreSQL database.

## How to Run

### Backend

1. Make sure Node.js and PostgreSQL are installed.

2. Create a PostgreSQL database named:

```text
expense_tracker

3. Run the following file on the database:
backend/schema.sql

4. Create a .env file inside the backend folder:
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=expense_tracker

5. Open a terminal inside the backend folder:
cd backend

6. Install the required packages:
npm install

7. Start the backend server:
npm start

The backend will run at:
http://localhost:3000

Frontend
1. Open the project in VS Code.
2. Open:
frontend/index.html

3. Run the file using the VS Code Live Server extension.
4. The Expense Tracker dashboard will open in your browser.
Features
- [x] Add an expense with validation
- [x] Delete an expense
- [x] Edit an expense
- [x] Filter by category
- [x] Summary cards (total, count, highest)
- [x] Data is saved in a PostgreSQL database
- [x] Responsive design
- [x] Backend API validation
- [x] Error handling and loading indicators
Demo Video
https://drive.google.com/drive/folders/1wGHudGa_WJWEo2mmK8tNhz_2cHyBc7lX?usp=sharing 
Screenshots
Screenshots are not included in this submission.
What Was the Hardest Part?
The hardest part was connecting the frontend with the backend API and making sure the data stays synchronized after adding, editing, or deleting expenses. I solved this using JavaScript fetch, async/await, Express API endpoints, and PostgreSQL.
Notes
- Do not upload or submit the .env file.
- Do not upload or submit the node_modules folder.