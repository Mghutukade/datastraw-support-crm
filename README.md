# Customer Support Ticketing CRM

A full-stack Customer Support Ticketing CRM built as part of the Datastraw Technologies AI + Tech Intern assessment. This application allows support teams to track, search, filter, and manage customer support tickets and internal activity notes seamlessly.

---

## 📖 Project Overview & Architecture

This application is designed with a clean, decoupled client-server architecture to ensure high performance, maintainability, and clean separation of concerns:

# Datastraw Support CRM

A full-stack support ticketing CRM application built to manage customer service requests with real-time tracking, comments, and status updates.

## 🚀 Live Demo
* **Frontend (Vercel):** [https://datastraw-support-crm-six.vercel.app/](https://datastraw-support-crm-six.vercel.app/)
* **Backend API (Render):** [https://datastraw-support-backend-rb9p.onrender.com](https://datastraw-support-backend-rb9p.onrender.com)

## 🛠️ Tech Stack
* **Frontend:** React, Vite, Tailwind CSS / UI Components
* **Backend:** FastAPI, Python, Pydantic, SQLAlchemy
* **Deployment:** Vercel (Frontend) & Render (Backend)

### 1. Backend Architecture (FastAPI & SQLite)
- **Framework:** Built using **FastAPI**, chosen for its high performance, automatic interactive API documentation (Swagger/ReDoc), and native support for asynchronous request handling.
- **ORM & Database:** Uses **SQLite** managed via **SQLAlchemy ORM**. The data model strictly adheres to a constrained relational structure consisting of only two core tables:
  - **`tickets`**: Stores primary ticket information including a unique UUID identifier (`ticket_uuid`), customer details (`customer_name`, `customer_email`), subject, description, priority (`Low`, `Medium`, `High`), status (`Open`, `In Progress`, `Resolved`, `Closed`), and timestamps.
  - **`notes`**: Stores internal activity logs and comments linked via a foreign key to `tickets` with **cascade delete** enabled (so deleting a ticket automatically cleans up its associated notes).
- **Advanced Query Filtering:** The GET endpoint implements robust query parameters (`search` and `status`) allowing agents to perform case-insensitive keyword searches across ticket subjects, customer names, and unique IDs, combined with real-time status filtering.

### 2. Frontend Architecture (React & Tailwind CSS)
- **Framework:** Developed with **React** and bundled using **Vite** for lightning-fast hot module replacement (HMR) and optimized production builds.
- **Styling:** Styled using **Tailwind CSS** for a modern, responsive, enterprise-grade user interface complete with status color-coding, subtle shadows, and intuitive modals.
- **Interactivity:** Features a dynamic ticket dashboard, a modal for generating new tickets with form validation, and an interactive detail/management modal where agents can update ticket statuses, adjust priorities, and append internal activity notes on the fly.

---

## 🛠️ Tech Stack

- **Backend:** Python, FastAPI, SQLite, SQLAlchemy, Pydantic
- **Frontend:** React, Vite, Tailwind CSS
- **Architecture:** RESTful API with a constrained 2-table relational database schema

---

## 📁 Project Structure

```text
support-crm/
│
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── database.py      # SQLite database connection & session setup
│   │   ├── main.py          # REST API endpoints & query filtering logic
│   │   ├── models.py        # SQLAlchemy ORM models (Ticket & Note)
│   │   └── schemas.py       # Pydantic validation schemas
│   └── venv/                # Python virtual environment (ignored in git)
│
├── frontend/                # React Frontend (Vite)
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js       # API integration layer for fetch requests
│   │   ├── App.jsx          # Main dashboard, modals, and state management
│   │   └── main.jsx         # React DOM entry point
│   ├── index.html           # HTML entry point with Tailwind CDN
│   ├── package.json         # Frontend dependencies & scripts
│   └── vite.config.js       # Vite configuration
│
└── .gitignore               # Git ignore rules for clean version control