# Quick Start Guide

## ✅ Step 1: Dependencies Installed
Dependencies have been installed successfully!

## 📝 Step 2: Create .env File

Run this command to create your .env file:
```bash
node setup-env.js
```

Or manually copy `env.template` to `.env` and fill in your credentials.

## 🗄️ Step 3: Set Up MySQL Database

### Option A: Using MySQL Command Line
```bash
mysql -u root -p < database.sql
```

### Option B: Using MySQL Workbench or phpMyAdmin
1. Open MySQL Workbench or phpMyAdmin
2. Create a new database called `bmi_calculator`
3. Run the SQL commands from `database.sql`

### Option C: Manual Setup
1. Connect to MySQL
2. Run:
   ```sql
   CREATE DATABASE IF NOT EXISTS bmi_calculator;
   USE bmi_calculator;
   ```
3. Then run all the CREATE TABLE statements from `database.sql`

## 🔐 Step 4: Configure .env File

Edit the `.env` file and update:

1. **MySQL Credentials:**
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=bmi_calculator
   ```

2. **JWT Secret:** (Already generated, but you can change it)

3. **Google OAuth:** (See Step 5)

## 🔵 Step 5: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google+ API**
4. Go to **APIs & Services** > **Credentials**
5. Click **Create Credentials** > **OAuth client ID**
6. Choose **Web application**
7. Add these:
   - **Authorized JavaScript origins:** `http://localhost:3000`
   - **Authorized redirect URIs:** `http://localhost:3000/auth/google/callback`
8. Copy the **Client ID** and **Client Secret**
9. Update `.env`:
   ```
   GOOGLE_CLIENT_ID=paste_your_client_id_here
   GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
   ```
10. Update `config.js`:
    ```javascript
    GOOGLE_CLIENT_ID: 'paste_your_client_id_here'
    ```

## 🚀 Step 6: Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## 🌐 Step 7: Access the Application

> **Important:** Signup/login now requires a verified Gmail account via Google Sign-In. Non-Gmail Google accounts are blocked.

Open your browser and go to:
- **Login (Gmail only):** http://localhost:3000/login.html
- **Sign Up (Gmail only):** http://localhost:3000/signup.html
- **BMI Calculator:** http://localhost:3000/index.html (requires Gmail login)

## ✅ Testing the Setup

1. **Test Database Connection:**
   - Start the server
   - Check console for any MySQL connection errors
   - If you see "Server running on http://localhost:3000", database connection is OK

2. **Test Google Sign-In:**
   - Go to login.html
   - Click "Sign in with Google"
   - You should be redirected to Google's sign-in page
   - After signing in, you should be redirected back and logged in

3. **Test BMI Calculation:**
   - Log in
   - Enter height and weight
   - Calculate BMI
   - Check if it saves to database (refresh page, history should persist)


## 🐛 Troubleshooting

### "Cannot connect to database"
- Check MySQL is running
- Verify credentials in `.env`
- Test connection: `mysql -u root -p`

### "Google Sign-In not working"
- Verify Client ID in both `.env` and `config.js`
- Check authorized origins in Google Cloud Console
- Ensure Google+ API is enabled

### Port already in use
- Change `PORT` in `.env` to a different port (e.g., 3001)
- Update `API_URL` in `config.js` to match

## 📚 Need More Help?

See `README.md` for detailed documentation.

