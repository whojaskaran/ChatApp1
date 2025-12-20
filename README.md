# Chat App

This is a full-stack chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io for real-time communication.

## Features

*   User authentication (signup and login)
*   Real-time messaging with Socket.io
*   See online users
*   Profile customization
*   Light/dark mode

## Tech Stack

*   **Frontend:** React, Tailwind CSS, Zustand
*   **Backend:** Node.js, Express, MongoDB, Socket.io
*   **Deployment:** Render (or any other platform that supports Node.js)

## Prerequisites

*   Node.js (v14 or later)
*   MongoDB Atlas account (or a local MongoDB instance)
*   Cloudinary account

## Local Development

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/chat-app.git
    cd chat-app
    ```

2.  **Install dependencies for the backend:**

    ```bash
    cd backend
    npm install
    ```

3.  **Install dependencies for the frontend:**

    ```bash
    cd ../frontend
    npm install
    ```

4.  **Set up environment variables:**

    *   Create a `.env` file in the `backend` directory and add the following:

        ```
        PORT=5000
        MONGODB_URI=<your_mongodb_uri>
        JWT_SECRET=<your_jwt_secret>
        CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
        CLOUDINARY_API_KEY=<your_cloudinary_api_key>
        CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
        ```

    *   Create a `.env` file in the `frontend` directory and add the following:

        ```
        VITE_API_URL=http://localhost:5000
        ```

5.  **Start the backend server:**

    ```bash
    cd ../backend
    npm start
    ```

6.  **Start the frontend development server:**

    ```bash
    cd ../frontend
    npm run dev
    ```

## Deployment

We will be using Render for the backend and Vercel for the frontend.

### Backend Deployment (Render)

1.  **Create a new Web Service on Render.**
2.  **Connect your GitHub repository.**
3.  **Configure the following settings:**
    *   **Name:** `chat-app-backend` (or any name you prefer)
    *   **Region:** Choose a region close to you.
    *   **Branch:** `main`
    *   **Root Directory:** `backend`
    *   **Build Command:** `npm install`
    *   **Start Command:** `npm start`
4.  **Add your environment variables** from `backend/.env`.
5.  **Click "Create Web Service".**

### Frontend Deployment (Vercel)

1.  **Create a new Project on Vercel.**
2.  **Connect your GitHub repository.**
3.  **Configure the following settings:**
    *   **Project Name:** `chat-app-frontend` (or any name you prefer)
    *   **Framework Preset:** `Vite`
    *   **Root Directory:** `frontend`
4.  **Add your environment variable:**
    *   **Key:** `VITE_API_URL`
    *   **Value:** The URL of your deployed backend (e.g., `https://chat-app-backend.onrender.com`)
5.  **Click "Deploy".** Vercel will automatically detect the build settings and the `dist` directory. The `vercel.json` file you created will handle client-side routing.

That's it! Your chat app should now be deployed.