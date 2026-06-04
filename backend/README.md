# AI Chatbot Backend

This is the backend part of the AI Chatbot project. It is built using Node.js and Express, providing the necessary APIs to support chat functionalities.

## Project Structure

- **src/**: Contains the source code for the backend.
  - **controllers/**: Contains the chat-related request handlers.
    - `chatController.js`: Exports functions for sending and receiving messages.
  - **routes/**: Defines the routes for chat operations.
    - `chatRoutes.js`: Uses functions from `chatController.js` to handle requests.
  - **services/**: Contains the logic for interacting with AI services.
    - `aiService.js`: Processes user input and generates responses.
  - **config/**: Manages database connection and configuration settings.
    - `db.js`: Contains database connection logic.
  - **middleware/**: Exports middleware for error handling.
    - `errorHandler.js`: Handles errors in the application.
  - `app.js`: Initializes the Express application and sets up middleware.
  - `server.js`: Starts the server and listens for incoming requests.

## Environment Variables

The backend uses environment variables for configuration. Create a `.env` file in the `backend` directory with the following variables:

```
DATABASE_URL=your_database_connection_string
API_KEY=your_api_key
```

## Installation

1. Navigate to the `backend` directory.
2. Run `npm install` to install the required dependencies.

## Running the Application

To start the server, run:

```
node src/server.js
```

The server will start and listen for incoming requests.

## API Endpoints

- **POST /chat/send**: Sends a message to the chat.
- **GET /chat/receive**: Receives messages from the chat.

## License

This project is licensed under the MIT License.