# Getting Started

## Prerequisites
- Node.js (v18 or higher)
- npm
- MySQL Server

---

## Clone the Repository
git clone https://github.com/ShorouqDerieh/HealthPal.git

---

## Install Dependencies
npm install

---

## Database Setup
Create a new MySQL database:
CREATE DATABASE healthcare_db;

---

## Environment Configuration
Create a `.env` file in the project root:

PORT=3100
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=healthcare_db
JWT_SECRET=your_jwt_secret

---

## Run the Application
npm start

The backend server will start on:
http://localhost:3100
