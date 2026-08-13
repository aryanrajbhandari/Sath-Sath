# Sath-Sath - Project Accomplishments Documentation

> **Last Updated:** August 8, 2026
> **Project Status:** Under Active Development

---

## 1. Project Overview

**Sath-Sath** is a crowdfunding/donation platform built as a Bachelor of Information Technology (BIT) final-year project by a team of three students. The platform enables users to create campaigns, make donations, and connect with each other.

### Core Concept
- A crowdfunding platform where users can create campaigns to raise funds
- Users can donate to campaigns and leave messages
- User authentication and authorization system
- Campaign management with creator tracking

---

## 2. Technology Stack

### Backend (Python/Django)
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | - | Backend programming language |
| Django | 6.0.7 | Web framework |
| Django REST Framework | - | REST API development |
| SimpleJWT | - | JWT authentication |
| django-mongodb-backend | - | MongoDB integration with Django |

### Frontend (React/Vite)
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.8 | UI library |
| Vite | 8.2.0 | Build tool and dev server |
| ESLint | 10.8.0 | Code linting |

### Database
| Technology | Purpose |
|-----------|---------|
| MongoDB Atlas | Cloud-hosted MongoDB database |
| Database Name | `sath_sath_db` |

### Development Tools
- Git & GitHub (version control)
- VS Code (code editor)
- Postman (API testing)

---

## 3. Accomplished Features

### 3.1 Backend Infrastructure

#### Django Project Setup
- [x] Django project initialized (`backend/`)
- [x] Django app created (`api/`)
- [x] Project configured with MongoDB backend
- [x] Environment variables configured (`.env`)
- [x] Settings module properly configured

#### Database Configuration
- [x] MongoDB Atlas cloud database connected
- [x] `django-mongodb-backend` integrated for MongoDB compatibility
- [x] Custom `ObjectIdAutoField` configured as default primary key
- [x] Database name: `sath_sath_db`

#### Custom Django Apps Configuration
- [x] `MongoAdminConfig` - Custom admin app config for MongoDB
- [x] `MongoAuthConfig` - Custom auth app config for MongoDB
- [x] `MongoContentTypesConfig` - Custom content types config for MongoDB

### 3.2 Data Models

#### Campaign Model (`api/models.py:4-16`)
| Field | Type | Description |
|-------|------|-------------|
| `id` | ObjectId (auto) | Primary key |
| `creator` | ForeignKey(User) | Campaign creator (nullable) |
| `title` | CharField(255) | Campaign title |
| `description` | TextField | Campaign description |
| `target_amount` | Decimal(12,2) | Fundraising goal |
| `raised_amount` | Decimal(12,2) | Amount raised (default: 0) |
| `image_url` | URLField | Optional campaign image |
| `is_active` | BooleanField | Campaign status (default: True) |
| `created_at` | DateTimeField | Auto-set creation timestamp |

#### Donation Model (`api/models.py:17-25`)
| Field | Type | Description |
|-------|------|-------------|
| `id` | ObjectId (auto) | Primary key |
| `campaign` | ForeignKey(Campaign) | Associated campaign |
| `donor_name` | CharField(255) | Donor's name |
| `amount` | Decimal(12,2) | Donation amount |
| `message` | TextField | Optional message (nullable) |
| `donated_at` | DateTimeField | Auto-set donation timestamp |

### 3.3 API Endpoints

#### Authentication Endpoints (`api/urls.py`)
| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| POST | `/api/auth/register/` | Register new user | Completed |
| POST | `/api/auth/login/` | Login (JWT token) | Completed |
| POST | `/api/auth/token/refresh/` | Refresh JWT token | Completed |

#### Campaign Endpoints (REST Framework ViewSet)
| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/api/campaigns/` | List all campaigns | Completed |
| POST | `/api/campaigns/` | Create campaign (auth required) | Completed |
| GET | `/api/campaigns/{id}/` | Get campaign details | Completed |
| PUT | `/api/campaigns/{id}/` | Update campaign | Completed |
| DELETE | `/api/campaigns/{id}/` | Delete campaign | Completed |

#### Donation Endpoints (REST Framework ViewSet)
| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| GET | `/api/donations/` | List all donations | Completed |
| POST | `/api/donations/` | Create donation | Completed |
| GET | `/api/donations/{id}/` | Get donation details | Completed |
| PUT | `/api/donations/{id}/` | Update donation | Completed |
| DELETE | `/api/donations/{id}/` | Delete donation | Completed |

### 3.4 Serializers (`api/serializers.py`)

| Serializer | Purpose | Features |
|-----------|---------|----------|
| `CampaignSerializer` | Campaign data serialization | Nested donations, read-only creator username |
| `DonationSerializer` | Donation data serialization | All fields exposed |
| `RegisterSerializer` | User registration | Password write-only, secure user creation |

### 3.5 Authentication System

- [x] JWT (JSON Web Token) authentication implemented
- [x] `rest_framework_simplejwt` configured
- [x] Token obtain endpoint (`/api/auth/login/`)
- [x] Token refresh endpoint (`/api/auth/token/refresh/`)
- [x] User registration with password hashing
- [x] Protected API routes (`IsAuthenticatedOrReadOnly`)

### 3.6 Django Admin

- [x] Campaign model registered in admin
- [x] Donation model registered in admin
- [x] Admin interface accessible at `/admin/`

### 3.7 Backend Codes Overview

#### Backend Project Structure

```
backend/
├── manage.py                  # Django CLI entry point (runserver, migrations, etc.)
├── .env                       # Environment variables (SECRET_KEY, MONGODB_URL, DEBUG)
│
├── backend/                   # Django project-level configuration
│   ├── __init__.py
│   ├── settings.py            # Core settings: DB, auth, apps, middleware, JWT config
│   ├── urls.py                # Root URL router — delegates /api/ to api app
│   ├── wsgi.py                # WSGI entry point for production deployment
│   ├── asgi.py                # ASGI entry point for async support
│   └── apps.py                # Custom MongoDB-compatible admin/auth/contenttypes configs
│
└── api/                       # Main API application
    ├── __init__.py
    ├── apps.py                # App config with MongoDB ObjectIdAutoField
    ├── models.py              # Campaign and Donation data models
    ├── serializers.py         # DRF serializers for data validation & conversion
    ├── views.py               # API viewsets and views (CRUD + auth logic)
    ├── urls.py                # API URL routing (router + auth endpoints)
    ├── admin.py               # Admin panel model registrations
    ├── tests.py               # Test file (empty, not yet implemented)
    └── migrations/            # Database migration files
        ├── 0001_initial.py
        └── 0002_*.py
```

#### Request Flow

Every API request follows this path through the codebase:

```
Client Request
      │
      ▼
backend/urls.py          ← Root router, forwards /api/* to api app
      │
      ▼
api/urls.py              ← Router maps endpoints to ViewSets; auth paths to views
      │
      ▼
api/views.py             ← Business logic: querysets, serialization, permissions
      │
      ▼
api/serializers.py       ← Validates input, converts between JSON ↔ model instances
      │
      ▼
api/models.py            ← Defines data structure (Campaign, Donation)
      │
      ▼
MongoDB (sath_sath_db)   ← django-mongodb-backend handles DB communication
```

#### Key File Walkthrough

**`backend/settings.py`** — Central configuration file
- Loads `.env` via `dotenv` for secrets (`DJANGO_SECRET_KEY`, `MONGODB_URL`)
- Configures MongoDB as the database backend using `django_mongodb_backend`
- Installs custom MongoDB app configs (`MongoAdminConfig`, `MongoAuthConfig`, `MongoContentTypesConfig`) instead of Django defaults
- Enables `JWTAuthentication` as the default DRF authentication class
- Sets `ObjectIdAutoField` as the default primary key type (required for MongoDB)

**`backend/urls.py`** — Root URL configuration
- Two routes only: `/admin/` (Django admin) and `/api/` (delegates to `api.urls`)
- All API logic lives under the `api/` namespace

**`api/urls.py`** — API routing layer
- Uses DRF's `DefaultRouter` to auto-generate REST routes for `CampaignViewSet` and `DonationViewSet`
- Manually defines three auth endpoints: `/auth/register/`, `/auth/login/`, `/auth/token/refresh/`
- Token endpoints use SimpleJWT's built-in views

**`api/views.py`** — Request handling and business logic
- `CampaignViewSet`: Full CRUD for campaigns; `perform_create` auto-assigns `request.user` as creator; `IsAuthenticatedOrReadOnly` allows public reads but requires auth for writes
- `DonationViewSet`: Full CRUD for donations (no permission restrictions currently)
- `RegisterView`: Accepts POST with username/email/password, creates user via `RegisterSerializer`, returns 201 on success

**`api/serializers.py`** — Data serialization and validation
- `CampaignSerializer`: Exposes all fields; nests `DonationSerializer` (read-only) for related donations; uses `ReadOnlyField` to display `creator.username` instead of user ID
- `DonationSerializer`: Straightforward ModelSerializer exposing all fields
- `RegisterSerializer`: Accepts username/email/password; password is write-only (never returned in responses); `create()` method uses `User.objects.create_user()` to hash the password

**`api/models.py`** — Data models
- `Campaign`: Title, description, target/raised amounts (DecimalField), image URL, active status, auto-timestamped creation; linked to User via nullable ForeignKey (`creator`)
- `Donation`: Donor name, amount (DecimalField), optional message, auto-timestamped donation time; linked to Campaign via ForeignKey (`campaign`)
- Both models auto-generate `ObjectId` primary keys via MongoDB backend

**`backend/apps.py`** — Custom MongoDB app configurations
- Three custom classes (`MongoAdminConfig`, `MongoAuthConfig`, `MongoContentTypesConfig`) extend Django's built-in app configs
- Override `default_auto_field` to `ObjectIdAutoField` so Django's auth, admin, and contenttypes apps work with MongoDB's ObjectId format instead of integer IDs

#### Authentication Flow

```
1. Register          POST /api/auth/register/   → RegisterView → RegisterSerializer.create() → User created
2. Login             POST /api/auth/login/      → TokenObtainPairView → Returns { access, refresh } tokens
3. Access protected   GET /api/campaigns/        → JWTAuthentication validates Bearer token → CampaignViewSet
4. Token expired      POST /api/auth/token/refresh/ → TokenRefreshView → Returns new access token
```

- Passwords are never stored in plain text — `create_user()` applies Django's password hashing
- JWT tokens contain user ID; `IsAuthenticatedOrReadOnly` allows unauthenticated users to read campaigns/donations

#### MongoDB Integration

- **Driver:** `django-mongodb-backend` replaces Django's default SQLite/PostgreSQL ORM layer
- **Database name:** `sath_sath_db` (configured in `settings.py`)
- **Connection:** MongoDB Atlas cloud instance; connection string stored in `MONGODB_URL` env variable
- **Primary keys:** All models use `ObjectIdAutoField` instead of auto-incrementing integers — this is the native MongoDB document `_id` format
- **Custom app configs:** Standard Django apps (`admin`, `auth`, `contenttypes`) are overridden to use `ObjectIdAutoField` as well, preventing compatibility issues with MongoDB

### 3.8 Frontend Setup

#### Project Initialization
- [x] Vite + React project scaffolded
- [x] ESLint configured with React hooks and refresh plugins
- [x] Development server configured
- [x] Build scripts defined (`dev`, `build`, `lint`, `preview`)

#### Current Frontend State
- Default Vite template with React counter demo
- Basic CSS styling with light/dark mode support
- Responsive design foundation
- **Note:** Custom application UI not yet implemented

### 3.9 Version Control & Git

#### Branches
| Branch | Purpose | Status |
|--------|---------|--------|
| `main` | Production-ready code | Active |
| `backend/authentication` | Auth feature development | Active (current) |
| `feature/initial-backend` | Initial backend setup | Merged |

#### Commit History (13 commits)
1. `c2a80f3` - Initial commit
2. `3beefbe` - First commit
3. `ba7cff9` - Second commit (env setup)
4. `60eb3cc` - Environment, gitignore, MongoDB setup complete
5. `2cb174f` - Campaign and donation API endpoints with MongoDB
6. `879e4a0` - Merge PR #1 (feature/initial-backend)
7. `b642098` - Added creator field to Campaign
8. `13123ec` - Merge PR #2 (feature/initial-backend)
9. `dda45bd` - Index on main
10. `05a9ee1` - Authentication implemented on main
11. `c1bf9e6` - Backend: add authentication (HEAD)

### 3.10 Configuration & Security

- [x] Environment variables loaded from `.env` file
- [x] `DJANGO_SECRET_KEY` stored in environment
- [x] `DJANGO_DEBUG` flag configurable
- [x] `MONGODB_URL` connection string in environment
- [x] `.env` file excluded from Git (`.gitignore`)
- [x] Password validation configured (4 validators)
- [x] CSRF middleware enabled
- [x] Security middleware configured

---

## 4. Database Migrations

| Migration | Date | Changes |
|-----------|------|---------|
| `0001_initial.py` | Aug 5, 2026 | Created Campaign and Donation models |
| `0002_campaign_creator_alter_donation_donated_at.py` | Aug 6, 2026 | Added `creator` FK to Campaign, changed `donated_at` to DateTimeField |

---

## 5. Project Structure

```
Sath-Sath/
├── backend/                    # Django backend
│   ├── api/                    # Main API app
│   │   ├── migrations/         # Database migrations
│   │   │   ├── 0001_initial.py
│   │   │   └── 0002_*.py
│   │   ├── admin.py           # Admin registrations
│   │   ├── apps.py            # App configuration
│   │   ├── models.py          # Campaign & Donation models
│   │   ├── serializers.py     # DRF serializers
│   │   ├── urls.py            # API URL routing
│   │   └── views.py           # API views/viewsets
│   ├── backend/               # Django project settings
│   │   ├── apps.py            # Custom MongoDB app configs
│   │   ├── settings.py        # Project settings
│   │   ├── urls.py            # Root URL configuration
│   │   ├── wsgi.py            # WSGI application
│   │   └── asgi.py            # ASGI application
│   ├── .env                   # Environment variables
│   ├── db.sqlite3             # SQLite (fallback/unused)
│   └── manage.py              # Django management
│
├── frontend/                   # React frontend
│   ├── public/                 # Static assets
│   ├── src/                    # Source code
│   │   ├── assets/            # Images & SVGs
│   │   ├── App.jsx            # Main component (Vite template)
│   │   ├── App.css            # Component styles
│   │   ├── index.css          # Global styles
│   │   └── main.jsx           # Entry point
│   ├── index.html             # HTML template
│   ├── package.json           # Dependencies
│   ├── vite.config.js         # Vite configuration
│   └── eslint.config.js       # ESLint configuration
│
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation
```

---

## 6. Known Issues & Bugs

| Issue | Location | Description |
|-------|----------|-------------|
| Typo in `perform_create` | `api/views.py:13` | `cretor` should be `creator` |
| No frontend API integration | `frontend/` | Frontend not connected to backend |
| No custom frontend UI | `frontend/` | Still using Vite default template |
| `ALLOWED_HOSTS` empty | `settings.py:31` | Needs configuration for deployment |
| Backend `.git` folder | `backend/.git` | Nested git repo (should be removed) |

---

## 7. What's NOT Yet Accomplished

### Backend
- [ ] Login view (currently using SimpleJWT's built-in view)
- [ ] User profile model/endpoint
- [ ] Campaign image upload functionality
- [ ] Donation-to-campaign amount aggregation
- [ ] User-specific campaign listing
- [ ] Search/filter campaigns
- [ ] Pagination for list endpoints
- [ ] Rate limiting
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Automated testing
- [ ] Deployment configuration

### Frontend
- [ ] Custom UI components
- [ ] Routing (react-router)
- [ ] API service layer (axios/fetch)
- [ ] Authentication screens (login/register)
- [ ] Campaign listing page
- [ ] Campaign creation form
- [ ] Campaign detail page
- [ ] Donation form
- [ ] User profile page
- [ ] State management
- [ ] Responsive mobile design
- [ ] Error handling & loading states

### DevOps & Infrastructure
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Production deployment
- [ ] Environment-specific configs
- [ ] Database backup strategy
- [ ] Logging & monitoring

---

## 8. Development Timeline

| Date | Milestone |
|------|-----------|
| Aug 4, 2026 | Initial project setup, repository created |
| Aug 4, 2026 | Backend environment and MongoDB configuration |
| Aug 5, 2026 | Campaign and Donation models created |
| Aug 5, 2026 | API endpoints for campaigns and donations |
| Aug 6, 2026 | Creator field added to Campaign model |
| Aug 6, 2026 | JWT authentication implemented |
| Aug 7, 2026 | Frontend project scaffolded with Vite + React |
| Aug 8, 2026 | Documentation created |

---

## 9. API Testing Guide

### Register a User
```http
POST /api/auth/register/
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "securepassword123"
}
```

### Login & Get Token
```http
POST /api/auth/login/
Content-Type: application/json

{
  "username": "testuser",
  "password": "securepassword123"
}
```

### Create Campaign (Authenticated)
```http
POST /api/campaigns/
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "Help Build a School",
  "description": "We need funds to build a school...",
  "target_amount": 50000.00
}
```

### Make a Donation
```http
POST /api/donations/
Content-Type: application/json

{
  "campaign": 1,
  "donor_name": "John Doe",
  "amount": 100.00,
  "message": "Happy to help!"
}
```

---

## 10. Team Contributions

| Member | Responsibilities | Contributions |
|--------|-----------------|---------------|
| Team Member 1 | Backend Development | Django setup, models, API, authentication |
| Team Member 2 | Frontend Development | React/Vite setup |
| Team Member 3 | Documentation / Development | Project documentation, README |

---

## 11. Next Steps (Priority Order)

1. **Fix typo** in `views.py` (`cretor` -> `creator`)
2. **Build frontend authentication** (login/register screens)
3. **Connect frontend to backend API**
4. **Create campaign UI** (list, create, detail views)
5. **Implement donation flow** in frontend
6. **Add user profile** functionality
7. **Write automated tests** for API
8. **Deploy** to production

---

*This document tracks the progress of the Sath-Sath project. Update it as new features are completed or requirements change.*
