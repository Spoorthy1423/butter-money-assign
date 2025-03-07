# Butter Money Document Processing System

A full-stack application for efficient handling of loan application documents, featuring document upload, PDF table extraction, and secure authentication.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Backend Implementation](#backend-implementation)
  - [Technologies Used](#backend-technologies)
  - [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [PDF Processing](#pdf-processing)
  - [Setup & Installation](#backend-setup)
- [Frontend Implementation](#frontend-implementation)
  - [Technologies Used](#frontend-technologies)
  - [Components](#components)
  - [State Management](#state-management)
  - [Setup & Installation](#frontend-setup)
- [Testing](#testing)
- [Deployment](#deployment)
- [Future Improvements](#future-improvements)

## Overview

The Document Processing System helps Butter Money efficiently handle loan application documents. It provides a secure platform for uploading, viewing, and processing PDF and DOCX files, with specific functionality for extracting tabular data from PDFs.

## Features

- **User Authentication**: Secure JWT-based authentication system
- **Document Management**: Upload, view, edit, and delete documents
- **PDF Processing**: Extract tables and structured data from PDF files
- **DOCX Editing**: View and edit DOCX files directly in the browser
- **Responsive UI**: Modern interface that works across devices
- **Secure API**: RESTful API with proper authentication and authorization

## Architecture

The application follows a client-server architecture:

```
┌─────────────┐      HTTP/REST     ┌─────────────┐
│   Frontend  │<─────────────────> │   Backend   │
│  (React.js) │                    │  (Node.js)  │
└─────────────┘                    └──────┬──────┘
                                          │
                                          │
                                    ┌─────▼─────┐
                                    │  MongoDB  │
                                    │ Database  │
                                    └───────────┘
```

## Backend Implementation

### Backend Technologies

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database for storing user and document data
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **pdf-parse**: Library for extracting data from PDFs
- **Multer**: Middleware for handling file uploads
- **bcrypt**: Library for password hashing

### API Endpoints

#### Authentication

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Authenticate user and receive JWT
- `POST /api/auth/logout`: Logout user (client-side token removal)
- `GET /api/auth/me`: Get current authenticated user data

#### Documents

- `POST /api/documents/upload`: Upload a new document
- `GET /api/documents`: Get all documents for the authenticated user
- `GET /api/documents/:id`: Get a specific document
- `GET /api/documents/:id/data`: Get extracted data from a document
- `DELETE /api/documents/:id`: Delete a document
- `POST /api/documents/:id/process`: Manually trigger processing for a document

### Authentication

Authentication is implemented using JWT (JSON Web Tokens):

1. User registers with email and password (password is hashed with bcrypt)
2. Upon login, the server validates credentials and returns a JWT
3. The client stores the JWT and includes it in the Authorization header for subsequent requests
4. Protected endpoints verify the JWT before processing requests
5. Tokens expire after a configurable time period (default: 7 days)

### PDF Processing

PDF processing follows these steps:

1. User uploads a PDF file
2. The file is stored on the server filesystem
3. A background process extracts text from the PDF using pdf-parse
4. Tables are identified in the text using pattern recognition
5. Extracted data is structured and stored in the database
6. The frontend can retrieve and display the processed data

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/Spoorthy1423/butter-money-assign.git
cd butter-money-doc-processing

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env file with your MongoDB URI and JWT secret

# Start the development server
npm run dev

# For production
npm run start
```

## Frontend Implementation

### Frontend Technologies

- **React.js**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **React Router**: For navigation and routing
- **Axios**: HTTP client for API requests
- **react-pdf**: PDF viewer component
- **draft.js**: Rich text editor for DOCX files
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form validation library

### Components

The frontend is organized into the following main components:

#### Authentication

- **LoginPage**: User login form with validation
- **RegisterPage**: New user registration
- **AuthContext**: React context for managing authentication state

#### Document Management

- **DocumentList**: Overview of all uploaded documents
- **DocumentUpload**: Form for uploading new documents
- **PDFViewer**: Component for viewing PDF files
- **DOCXEditor**: Component for viewing and editing DOCX files

#### PDF Processing

- **PDFProcessingPage**: Interface for uploading PDFs for table extraction
- **TableViewer**: Component for displaying extracted table data

### State Management

The application uses React's Context API for global state management:

- **AuthContext**: Manages authentication state, user data, and tokens
- **DocumentContext**: Manages document list and current document
- **NotificationContext**: Manages application notifications and alerts

### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env file with your API base URL

# Start the development server
npm start

# Build for production
npm run build
```

## Testing

### Backend Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run all tests with coverage
npm run test:coverage
```

### Frontend Testing

```bash
# Navigate to the frontend directory
cd frontend

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests (using Cypress)
npm run test:e2e
```

## Deployment

The application can be deployed in various ways:

### Docker Deployment

```bash
# Build Docker images
docker-compose build

# Start services
docker-compose up -d
```

### Manual Deployment

1. Set up a MongoDB instance (Atlas or self-hosted)
2. Deploy the Node.js backend to a server (e.g., AWS EC2, Heroku)
3. Build and deploy the React frontend to a static hosting service (e.g., Netlify, Vercel)
4. Configure CORS and environment variables appropriately

## Future Improvements

- **Advanced PDF Processing**: Implement more sophisticated table extraction using machine learning
- **Document Classification**: Automatically categorize documents based on content
- **Bulk Operations**: Support for batch uploading and processing
- **Reporting**: Generate reports based on extracted data
- **Workflow Integration**: Connect with loan approval workflows
- **Real-time Collaboration**: Enable multiple users to view and edit documents simultaneously