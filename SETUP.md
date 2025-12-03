# Quick Setup Guide

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Set Up MySQL Database
1. Make sure MySQL is running
2. Create the database:
   ```bash
   mysql -u root -p < database.sql
   ```
   Or manually:
   ```sql
   CREATE DATABASE bmi_calculator;
   USE bmi_calculator;
   -- Then run the SQL from database.sql
   ```

## Step 3: Configure Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials (Web application)
3. Enable the Google+ API

## Step 4: Create .env File
Create a `.env` file in the project root with:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bmi_calculator
JWT_SECRET=your_random_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

## Step 5: Update Frontend Config
Edit `config.js` and replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Google Client ID.

## Step 6: Start the Server
```bash
npm start
```

## Step 7: Open in Browser
Navigate to: `http://localhost:3000/login.html`

## Troubleshooting

### "Cannot connect to database"
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in `.env`
- Ensure database exists: `SHOW DATABASES;`

### "Google Sign-In not working"
- Verify Client ID in `config.js` matches the one in `.env`
- Check authorized origins in Google Cloud Console
- Ensure Google+ API is enabled

