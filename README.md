# Sath-Sath

> **Sath-Sath** is a final-year project developed by a team of three students. The project aims to build a platform that helps people connect and interact with each other through a simple and user-friendly application.

## 📌 About the Project

Sath-Sath is being developed as a **Bachelor of Information Technology (BIT) final-year project**.

The project focuses on building a complete application with a mobile frontend, backend server, database, authentication, and APIs.

The main goal of the project is to create a useful, secure, and scalable application while learning and applying real-world software development practices.

---

## 🎯 Objectives

The main objectives of Sath-Sath are:

* Build a functional and user-friendly application.
* Develop a secure backend system.
* Store and manage application data using MongoDB.
* Provide APIs for communication between the frontend and backend.
* Implement user authentication and authorization.
* Follow proper software development practices.
* Learn how real-world applications are designed and developed.

---

## ✨ Features

The application is being developed with the following core features:

* User registration and login
* User authentication
* User profiles
* User-related features and interactions
* Backend API
* MongoDB database
* Secure data handling
* Input validation
* Role-based access where required

> Features may change or be added as development continues.

---

## 🛠️ Technology Stack

### Frontend

* React Native

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Development Tools

* Git
* GitHub
* VS Code
* Postman

---

## 🏗️ System Architecture

The basic architecture of Sath-Sath is:

```text
┌─────────────────────┐
│    React Native     │
│      Frontend       │
└──────────┬──────────┘
           │
           │ HTTP / REST API
           ▼
┌─────────────────────┐
│   Node.js +         │
│   Express.js        │
│      Backend        │
└──────────┬──────────┘
           │
           │ Database Queries
           ▼
┌─────────────────────┐
│      MongoDB        │
│      Database       │
└─────────────────────┘
```

The frontend communicates with the backend through APIs.
The backend processes requests and communicates with MongoDB to store and retrieve data.

---

## 📂 Project Structure

The backend is organized into separate folders so that different parts of the application are easier to manage.

```text
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── app.js
│
├── .env
├── .gitignore
├── package.json
└── server.js
```

### Folder Purpose

| Folder        | Purpose                                           |
| ------------- | ------------------------------------------------- |
| `config`      | Database and application configuration            |
| `controllers` | Handles application logic for requests            |
| `middleware`  | Functions that run between requests and responses |
| `models`      | MongoDB data models                               |
| `routes`      | Defines API endpoints                             |
| `services`    | Contains reusable business logic                  |

> The structure may change as the backend grows.

---

## 🔐 Authentication

Sath-Sath uses authentication to identify users and protect private resources.

The authentication system will handle:

* User registration
* User login
* Password security
* Authentication tokens
* Protected API routes
* Authorization where required

Sensitive information such as passwords and secret keys will not be stored directly in the source code.

---

## 🗄️ Database

Sath-Sath uses **MongoDB** as its database.

MongoDB stores application information in collections and documents.

The database will contain collections for different types of application data.

Example:

```text
MongoDB
│
├── users
├── profiles
└── other application collections
```

The exact database structure will be updated as development progresses.

---

## 🔌 API

The backend provides REST APIs that allow the frontend to communicate with the server.

Example API structure:

| Method | Endpoint             | Purpose             |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user          |
| GET    | `/api/users/profile` | Get user profile    |

More API endpoints will be added as features are implemented.

---

## ⚙️ Getting Started

### Requirements

Before running the backend, make sure the following are installed:

* Node.js
* MongoDB
* Git
* A code editor such as VS Code

### 1. Clone the Repository

```bash
git clone <repository-url>
```

### 2. Go to the Backend Folder

```bash
cd backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create Environment Variables

Create a `.env` file in the backend folder.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Do not upload the `.env` file to GitHub.

### 5. Start the Server

For development:

```bash
npm run dev
```

Or:

```bash
npm start
```

The exact command may change depending on the project configuration.

---

## 🧪 Testing

Testing is performed during development to make sure that the backend works correctly.

Tools currently being used/planned:

* Postman for API testing
* Manual testing
* Database testing
* Automated testing where required

Each API will be tested for:

* Correct responses
* Invalid input
* Authentication
* Authorization
* Error handling

---

## 👥 Team

Sath-Sath is being developed by a team of three students.

| Member        | Responsibility                                       |
| ------------- | ---------------------------------------------------- |
| Team Member 1 | Backend Development                                  |
| Team Member 2 | Frontend Development                                 |
| Team Member 3 | Development / Documentation / Other responsibilities |

The responsibilities may be adjusted during development.

---

## 🚧 Project Status

**Status: Under Development**

Current development focus:

* Backend development
* Database design
* API development
* Authentication
* Security
* Frontend integration

The project is being developed incrementally, with features being implemented and tested step by step.

---

## 🔮 Future Improvements

Possible future improvements include:

* Additional application features
* Improved user experience
* Better performance
* More advanced security
* Additional APIs
* Automated testing
* Cloud deployment
* Scalability improvements

---

## 📚 Documentation

Detailed project documentation will cover:

* Project introduction
* Problem statement
* Objectives
* Scope
* Requirements
* Technology stack
* System architecture
* Database design
* API documentation
* Authentication and security
* Use cases
* Testing
* Deployment
* Limitations
* Future enhancements

---

## 📄 License

This project is developed as an academic final-year project.

More information about the project's license and usage will be added later.
