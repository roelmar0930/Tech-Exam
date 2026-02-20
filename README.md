# Web Ordering App

A full-stack web application built with React (Frontend) and Node.js/Express (Backend).

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (Node Package Manager)

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript code:
```bash
npm run build
```

4. To run the development server:
```bash
npm run dev
```

The backend server will start running on `http://localhost:3000` (or your configured port).

### Available Backend Scripts

- `npm run dev` - Starts the development server with hot-reload
- `npm run build` - Builds the TypeScript code
- `npm start` - Runs the built application in production mode

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. To start the development server:
```bash
npm start
```

The frontend application will start running on `http://localhost:3000` and will automatically open in your default browser.

### Available Frontend Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm run eject` - Ejects from Create React App

## Tech Stack

### Frontend
- React
- TypeScript
- Material-UI (MUI)
- Redux Toolkit
- React Router
- Axios

### Backend
- Node.js
- Express
- TypeScript
- Cors
- Axios

## Development

To work on the full application:

1. Start the backend server first:
```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm start
```

Now you can access:
- Frontend: http://localhost:3000
- Backend: http://localhost:3000 (or your configured port)

Make sure both servers are running simultaneously for the application to work properly.