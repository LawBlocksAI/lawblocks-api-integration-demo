# Marketplace API Integration Demo

This project serves as a demonstration and reference implementation for integrating with the **Marketplace APIs**. It showcases how developers can seamlessly build applications to upload documents, manage files, and initialize document signing sessions using the Marketplace's powerful API ecosystem.

The demo consists of a modern React frontend and an Express (Node.js) backend that acts as a secure proxy to interact with the Marketplace APIs.

## 🚀 Key Demonstration Features

- **API Integration Architecture**: Best practices for structuring an Express backend to proxy requests to Marketplace APIs securely.
- **Document Upload Flow**: Example implementation of pushing files to the Marketplace.
- **Document Management**: Demonstrates fetching and displaying a list of documents associated with the user/account.
- **Signing Sessions**: Shows how to initialize a document signing session and handle tokenized signing links.
- **Responsive UI**: A clean, mobile-first interface built with React and Tailwind CSS to test the integration visually.

## 🛠️ Tech Stack

### Frontend (Client-side)
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React

### Backend (API Proxy)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose) - *Used for local state mapping if required by the integration*
- **HTTP Client**: Axios (for calling Marketplace APIs)
- **Middleware**: CORS, Express JSON, Morgan

## 📂 Project Structure

```
marketplace_api_integration/
├── backend/                  # Express API Server (Marketplace Proxy)
│   ├── src/
│   │   ├── config/           # Database & environment configurations
│   │   ├── controller/       # Integration logic for Marketplace APIs
│   │   ├── routes/           # Express routes exposing endpoints to the frontend
│   │   └── index.js          # Server entry point
│   ├── .env                  # Environment variables (API Keys, Secrets)
│   └── package.json
│
├── frontend/                 # React Web Application (Demo UI)
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── pages/            # Page components (Upload, Documents, Sign)
│   │   ├── App.jsx           # Main application component
│   │   └── main.jsx          # React entry point
│   ├── vite.config.js        # Vite configuration
│   ├── tailwind.config.js    # Tailwind setup
│   └── package.json
└── README.md
```

## ⚙️ Prerequisites

Before you begin, ensure you have the following:
- **Node.js**: v20 or higher recommended.
- **Marketplace API Credentials**: You will need valid API keys/tokens from your Marketplace Developer Portal.
- **MongoDB**: A running instance of MongoDB for the backend proxy state.

## 🚀 Setup & Installation

### 1. Clone the repository
```bash
git clone <your-repository-url>
cd marketplace_api_integration
```

### 2. Configure the Backend Proxy
Navigate to the backend directory, install dependencies, and set up your environment variables.
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/doc_sign_test

# Lawblocks Marketplace API Configuration
LAWBLOCK_API_BASE_URL=https://marketapi.lawblocks.io/api/v1
LAWBLOCK_SECRET_API_KEY=your_api_secret_here
```

Start the backend development server:
```bash
npm run dev
```
*The API proxy server will run on `http://localhost:5001`.*

### 3. Configure the Frontend UI
Open a new terminal window, navigate to the frontend directory, and install dependencies.
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` folder:
```env
VITE_API_BASE_URL=http://localhost:5001
```

Start the Vite development server:
```bash
npm run dev
```
*The Demo UI will run on `http://localhost:5173`.*

## 📡 Exposed API Proxy Endpoints

The Express backend exposes the following endpoints to the React frontend, which in turn communicate with the **Marketplace APIs**:

- `POST /api/docsign/upload-doc` - Push a new document to the Marketplace.
- `POST /api/docsign/session/init` - Trigger a new signing session via the Marketplace API.
- `GET /api/docsign/token` - Validate and retrieve document details using a signing token.
- `GET /` - Proxy server health check.

## 📜 License

This demo project is provided under the ISC License. Feel free to use and modify the code to jumpstart your integration with the Marketplace APIs!
