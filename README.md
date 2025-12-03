# BMI Calculator with Google OAuth and MySQL

A full-stack BMI calculator application with Google Sign-In authentication and MySQL database storage for BMI tracking.

## Features

- ✅ Google OAuth 2.0 Sign-In/Sign-Up
- ✅ MySQL database for user and BMI data storage
- ✅ Secure JWT-based authentication
- ✅ BMI calculation and history tracking

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- Google Cloud Platform account
- npm or yarn

## Setup Instructions

### 1. Database Setup

1. Start your MySQL server
2. Run the database schema:
   ```bash
   mysql -u root -p < database.sql
   ```
   Or manually execute the SQL commands in `database.sql`

### 2. Google Cloud Platform Setup

#### A. Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** (for OAuth)
4. Go to **APIs & Services** > **Credentials**
5. Click **Create Credentials** > **OAuth client ID**
6. Choose **Web application**
7. Add authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://localhost` (if serving frontend separately)
8. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
9. Copy the **Client ID** and **Client Secret**

### 3. Environment Configuration

1. Create a `.env` file in the project root:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # MySQL Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=bmi_calculator

   # JWT Secret (generate a random string)
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

   # Google OAuth 2.0 Credentials
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
   ```

### 4. Update Frontend Google Client ID

1. Open `login.html` and `signup.html`
2. Find `YOUR_GOOGLE_CLIENT_ID` and replace it with your actual Google Client ID
3. The line should look like:
   ```javascript
   client_id: 'your_actual_google_client_id_here',
   ```

### 5. Install Dependencies

```bash
npm install
```

### 6. Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 7. Access the Application

> **Gmail only**: Traditional username/password accounts have been removed. Users must authenticate with a verified Gmail account through Google Sign-In. Non-Gmail Google accounts are rejected on the backend.

Open your browser and navigate to:
- `http://localhost:3000/login.html` - Login page (Gmail/Google Sign-In)
- `http://localhost:3000/signup.html` - Sign up page (Gmail/Google Sign-Up)
- `http://localhost:3000/index.html` - BMI Calculator (requires login)

## API Endpoints

### Authentication
- `GET /auth/google` - Get Google OAuth URL
- `POST /auth/google/callback` - Handle OAuth callback
- `POST /auth/google/verify` - Verify Google ID token

### BMI
- `POST /api/bmi` - Save BMI record (requires authentication)
- `GET /api/bmi/history` - Get BMI history (requires authentication)
- `DELETE /api/bmi/history` - Clear BMI history (requires authentication)

## Project Structure

```
IT107-main/
├── server.js              # Express backend server
├── database.sql           # MySQL database schema
├── package.json           # Node.js dependencies
├── .env                   # Environment variables (create this)
├── index.html             # BMI Calculator page
├── login.html             # Login page
├── signup.html            # Sign up page
├── script.js              # Frontend JavaScript
└── style.css              # Styles
```

## Troubleshooting

### Database Connection Issues
- Ensure MySQL server is running
- Verify database credentials in `.env`
- Check that the database `bmi_calculator` exists

### Google OAuth Issues
- Verify Client ID and Secret in `.env`
- Check authorized origins and redirect URIs in Google Cloud Console
- Ensure the frontend Client ID matches the backend Client ID

## Security Notes

- Never commit `.env` to version control
- Use strong, unique JWT secrets in production
- Keep your Google OAuth credentials secure
- Use HTTPS in production

## License

ISC

