# BoostBoard - Productivity Dashboard Application

BoostBoard is a comprehensive productivity dashboard application designed to help users organize tasks, track progress, and enhance work efficiency.

## Features

- **Task Management**: Create, organize, and prioritize tasks with drag-and-drop functionality
- **Progress Tracking**: Visual charts and progress indicators to monitor productivity
- **Dashboard Customization**: Personalize your productivity workspace
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Dark/Light Mode**: Choose your preferred theme for comfortable viewing

## Tech Stack

### Frontend
- React with TypeScript
- Vite for fast development and building
- React Router for navigation
- Shadcn UI components
- Tailwind CSS for styling
- React Query for data fetching
- React Hook Form for form handling
- Zod for validation

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- dotenv for environment configuration

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas connection)

### Client Setup
1. Navigate to the client directory:
   ```bash
   cd d:\Productivity\client
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the client directory with the following content:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The client will be available at `http://localhost:8080`

### Server Setup
1. Navigate to the server directory:
   ```bash
   cd d:\Productivity\server
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the server directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/boostboard
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The server will be available at `http://localhost:5000`

## Development Workflow

1. Make sure both the client and server are running
2. API endpoints are accessible at `http://localhost:5000/api/*`
3. The client automatically proxies API requests to the server

## Production Deployment

### Building the Client
```bash
cd d:\Productivity\client
npm run build
# or
yarn build
```

### Running the Server in Production
```bash
cd d:\Productivity\server
npm start
# or
yarn start
```

## Project Structure

```
d:\Productivity/
├── client/             # Frontend React application
│   ├── public/         # Static assets
│   └── src/            # Source code
│       ├── components/ # Reusable components
│       ├── pages/      # Application pages
│       └── ...         # Other directories
│
└── server/             # Backend Node.js application
    ├── controllers/    # Request handlers
    ├── models/         # Database models
    ├── routes/         # API routes
    └── server.js       # Entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

[MIT](LICENSE)
