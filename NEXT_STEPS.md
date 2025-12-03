# ✅ Next Steps - What's Been Done

## Completed Automatically

1. ✅ **Dependencies Installed**
   - All npm packages installed (157 packages)
   - No vulnerabilities found

2. ✅ **.env File Created**
   - Environment configuration file created
   - JWT secret automatically generated
   - Ready for you to add your credentials

3. ✅ **Helper Scripts Created**
   - `setup-env.js` - Creates .env file
   - `test-db-connection.js` - Tests MySQL connection
   - Added npm scripts: `npm run setup`, `npm run test-db`

4. ✅ **Documentation Created**
   - README.md - Full documentation
   - SETUP.md - Setup instructions
   - QUICK_START.md - Quick start guide
   - SETUP_CHECKLIST.md - Setup checklist

## 🔧 What You Need to Do Now

### Step 1: Set Up MySQL (REQUIRED)

**Option A: If MySQL is installed but not in PATH**
1. Find MySQL installation (usually `C:\Program Files\MySQL\MySQL Server X.X\bin`)
2. Add to PATH or use full path
3. Run: `mysql -u root -p < database.sql`

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Create new database: `bmi_calculator`
4. Open and run `database.sql` file

**Option C: Using phpMyAdmin (if using XAMPP/WAMP)**
1. Open phpMyAdmin (usually http://localhost/phpmyadmin)
2. Create database: `bmi_calculator`
3. Import `database.sql` file

**After setting up database:**
1. Edit `.env` file
2. Update `DB_PASSWORD` with your MySQL root password
3. Test connection: `npm run test-db`

### Step 2: Configure Google OAuth (REQUIRED for Google Sign-In)

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create/Select Project:**
   - Click "Select a project" → "New Project"
   - Name it "BMI Calculator" (or any name)
   - Click "Create"

3. **Enable API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" → Enable it

4. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure OAuth consent screen:
     - User Type: External
     - App name: BMI Calculator
     - Support email: your email
     - Click "Save and Continue" through the steps
   - Application type: Web application
   - Name: BMI Calculator Web Client
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
   - Click "Create"
   - **Copy the Client ID and Client Secret**

5. **Update Configuration:**
   - Edit `.env` file:
     ```
     GOOGLE_CLIENT_ID=paste_your_client_id_here
     GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
     ```
   - Edit `config.js` file:
     ```javascript
     GOOGLE_CLIENT_ID: 'paste_your_client_id_here'
     ```

### Step 3: Start the Server

```bash
npm start
```

You should see:
```
Server running on http://localhost:3000
Make sure MySQL is running and database is created!
```

### Step 4: Test the Application

1. **Open Browser:**
   - Go to: http://localhost:3000/login.html

2. **Test Google Sign-In:**
   - Click "Sign in with Google"
   - Sign in with your Google account
   - You should be redirected back and logged in

3. **Test BMI Calculator:**
   - Enter height (cm) and weight (kg)
   - Click "Calculate"
   - Check if history appears

## 🐛 Troubleshooting

### "Cannot connect to database"
- **Solution:** Make sure MySQL is running
- **Check:** `npm run test-db` for detailed error

### "Google Sign-In button not showing"
- **Check:** `config.js` has correct Client ID
- **Check:** Google+ API is enabled
- **Check:** Authorized origins include `http://localhost:3000`

### "Port 3000 already in use"
- **Solution:** Change `PORT` in `.env` to another port (e.g., 3001)
- **Update:** `config.js` API_URL to match new port

## 📞 Need Help?

- Check `README.md` for detailed documentation
- Check `QUICK_START.md` for step-by-step guide
- Check `SETUP_CHECKLIST.md` for checklist

## 🎉 You're Almost There!

Once you complete:
1. ✅ MySQL setup
2. ✅ Google OAuth configuration

Your BMI Calculator with Google Sign-In and database storage will be fully functional!

