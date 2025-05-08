# Real-Time Chat App

## Overview
This is a real-time chat application built with React on the client side and Node.js on the server side. It uses Socket.IO for real-time communication, allowing users to send and receive messages instantly. The app features user authentication, chat rooms, and a clean, responsive UI.

## Features
- Real-time messaging using Socket.IO
- User authentication (basic setup with environment variables)
- Responsive UI with React and Tailwind CSS
- Chat room functionality
- Persistent data storage (via a database, configurable in the server)

## Project Structure

### Server Side
```
├── config/               # Configuration files (e.g., database setup)
├── controllers/          # Request handlers for routes
├── middlewares/          # Custom middleware functions
├── models/               # Database models (e.g., User, Message)
├── routes/               # API route definitions
├── socket/               # Socket.IO logic for real-time communication
├── .env                  # Environment variables (e.g., database URI, port)
├── documentation.json    # API documentation configuration
├── index.js              # Server entry point
├── package-lock.json     # Dependency lock file
└── package.json          # Server dependencies and scripts
```

### Client Side
```
├── public/               # Static assets (e.g., index.html)
├── src/                  # React source code
│   ├── assets/           # Images, icons, and other static assets
│   ├── component/        # Reusable React components
│   ├── data/             # Mock data or constants
│   ├── pages/            # Page components (e.g., Chat, Login)
│   ├── styles/           # CSS styles (e.g., Tailwind CSS)
│   ├── App.css           # App-level styles
│   ├── App.jsx           # Main App component
│   ├── index.css         # Global styles
│   └── main.jsx          # Client entry point
├── .gitignore            # Git ignore file
├── README.md             # Project documentation
├── client.rar            # Archived client files (if applicable)
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML entry point
├── package-lock.json     # Dependency lock file
├── package.json          # Client dependencies and scripts
└── vite.config.js        # Vite configuration for the React app
```

## Prerequisites
- Node.js (v16 or higher)
- npm (v7 or higher)
- A database (e.g., MongoDB, if configured in the server)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/mohamedadel96e/Real-Time-Chat-App
cd chat-app
```

### 2. Server Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the server root and add the following:
   ```
   PORT=5010
   DATABASE_URL=mongodb+srv://mohamedadel96e:sBQZ6lRROTaiCABS@mychatappdb.jfnf9.mongodb.net/?retryWrites=true&w=majority&appName=myChatAppDB
   ```
4. Start the server:
   ```bash
   npm start
   ```

### 3. Client Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the client (using Vite):
   ```bash
   npm run dev
   ```
4. Open `http://localhost:5173` in your browser (or the port specified by Vite).

## Usage
1. Launch the server and client as described above.
2. Open the client URL in your browser.
3. Register or log in to access the chat interface.
4. Join a chat room and start messaging in real time.

## Technologies Used
- **Client**: React, Socket.IO-client, Tailwind CSS, Vite
- **Server**: Node.js, Express, Socket.IO, MongoDB 
- **Other**: npm (package management)


## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License.