🌐 Live Demo: https://ai-chatbot-chi-ashen.vercel.app

# AI Chatbot Project

This project is a simple AI chatbot application that consists of a backend and a frontend. The backend is built using Node.js and Express, while the frontend is developed using React and Vite.

## Project Structure

The project is organized into two main directories: `backend` and `frontend`.

### Backend

The backend directory contains the server-side code for handling chat operations.

- **src/controllers/chatController.js**: Contains functions to handle chat-related requests, such as sending and receiving messages.
- **src/routes/chatRoutes.js**: Defines the routes for chat operations and connects them to the controller functions.
- **src/services/aiService.js**: Implements the logic for interacting with AI services, processing user input, and generating responses.
- **src/config/db.js**: Manages the database connection and configuration settings.
- **src/middleware/errorHandler.js**: Exports middleware for handling errors in the application.
- **src/app.js**: Initializes the Express application, sets up middleware, and imports routes.
- **src/server.js**: Starts the server and listens for incoming requests.
- **.env**: Contains environment variables for the application, such as database connection strings and API keys.
- **package.json**: Configuration file for npm, listing dependencies and scripts.

### Frontend

The frontend directory contains the client-side code for the chatbot interface.

- **public/vite.svg**: A static asset used in the frontend application.
- **src/assets/**: Directory for static assets used in the frontend.
- **src/components/**: Contains React components for the application, including:
  - **Sidebar.jsx**: Navigation component.
  - **ChatBox.jsx**: Displays the chat interface.
  - **Message.jsx**: Represents individual chat messages.
  - **Navbar.jsx**: Application header component.
  - **TypingAnimation.jsx**: Shows a typing indicator.
- **src/pages/Home.jsx**: Main view of the application.
- **src/api/chatApi.js**: Functions for making API calls related to chat operations.
- **src/App.jsx**: Main application component that sets up routing and renders other components.
- **src/main.jsx**: Entry point for the React application.
- **src/index.css**: Global styles for the frontend application.
- **src/App.css**: Styles specific to the App component.
- **package.json**: Configuration file for npm, listing dependencies and scripts.
- **vite.config.js**: Configuration settings for Vite, the build tool used for the frontend application.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository.
2. Navigate to the `backend` directory and install the dependencies:
   ```
   cd backend
   npm install
   ```
3. Set up your environment variables in the `.env` file.
4. Start the backend server:
   ```
   npm start
   ```
5. Navigate to the `frontend` directory and install the dependencies:
   ```
   cd ../frontend
   npm install
   ```
6. Start the frontend application:
   ```
   npm run dev
   ```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
