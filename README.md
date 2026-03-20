# Destination254

A mobile travel-sharing platform where users can discover, rate, and share travel destinations. Travelers can upload photos, write short reviews, and inspire others to explore new places. The app focuses on real experiences from real travelers, making it easier to find authentic travel recommendations.

![App Screenshots](screenshots/app-preview.png)

## Features

-  **User Authentication** - Secure JWT-based login and registration with automatic avatar generation
-  **Share Destinations** - Upload photos, add captions, and rate places you've visited (1-5 stars)
-  **Home Feed** - Browse destinations from all travelers with infinite scroll pagination
-  **User Profiles** - View your shared destinations with delete functionality
-  **Mobile-First** - Built with React Native for iOS and Android
-  **Cloud Storage** - Images stored on Cloudinary with automatic cleanup
-  **Pull-to-Refresh** - Smooth refresh controls on all lists
-  **Modern UI** - Clean, intuitive interface with custom styling

## Tech Stack

### Backend
- **Node.js** + **Express.js** - REST API framework
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **Cloudinary** - Image upload and storage
- **Bcrypt.js** - Password hashing
- **Cron** - Scheduled tasks

### Frontend
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform and tooling
- **Expo Router** - File-based routing
- **Zustand** - State management
- **AsyncStorage** - Local persistence
- **Expo Image Picker** - Camera roll access
- **React Navigation** - Tab and stack navigation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account
- Expo Go app (for mobile testing)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend

2. Install dependencies:
    ```bash
    npm install

3. Create a .env file:
    ```bash
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    API_URL=https://your-deployed-url.com

4. Start the development server:
   ```bash
   npm run dev

### Frontend Setup

1. Navigate to the mobile directory:
    ```bash
    cd mobile

2. Install dependencies:   
   ```bash
    npm install

3. Update constants/api.js with your backend URL: 
   ```bash
    export const API_URL = "http://localhost:3000/api"; // or your deployed URL

4. Start the Expo development server: 
   ```bash
    npx expo

5. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## Screens

| Screen      | Description                                     |
| ----------- | ----------------------------------------------- |
| **Login**   | User authentication with email/password         |
| **Home**    | Feed of all destinations with infinite scroll   |
| **Create**  | Form to add new destination with image upload   |
| **Profile** | User's own destinations with management options |


## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login existing user
  
### Destinations
- GET /api/destinations - Get all destinations (paginated)
- GET /api/destinations/user - Get current user's destinations
- POST /api/destinations - Create new destination
- DELETE /api/destinations/:id - Delete destination

## Key Features Explained

### Infinite Scroll Pagination
The home screen implements cursor-based pagination with 2 items per page, loading more as the user scrolls.

### Image Handling
- Images are converted to base64 on the client
- Uploaded to Cloudinary for storage
- Automatically deleted from Cloudinary when posts are removed
  
### Authentication Flow
- JWT tokens stored in AsyncStorage
- Automatic token refresh on app launch
- Protected routes middleware
  
### State Management
Zustand store handles:
- User authentication state
- Token persistence
- Loading states