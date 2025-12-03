const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bmi_calculator',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Google OAuth Client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback'
);

// JWT Middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Helper to ensure Gmail-only accounts
function ensureGmailAccount(payload) {
  const email = payload?.email || '';
  if (!payload?.email_verified) {
    throw new Error('Google account is not verified');
  }
  if (!/@gmail\.com$/i.test(email)) {
    throw new Error('Only Gmail addresses are allowed for signup');
  }
}

async function syncGoogleUser(payload, { createIfMissing = false } = {}) {
  ensureGmailAccount(payload);

  const { sub: googleId, email, name, picture } = payload;

  const [existingUsers] = await pool.execute(
    'SELECT * FROM users WHERE google_id = ? OR email = ?',
    [googleId, email]
  );

  if (existingUsers.length === 0) {
    if (!createIfMissing) {
      throw new Error('Account not registered. Please sign up first.');
    }

    const [result] = await pool.execute(
      'INSERT INTO users (google_id, email, name, picture) VALUES (?, ?, ?, ?)',
      [googleId, email, name, picture]
    );

    return {
      user: {
        id: result.insertId,
        google_id: googleId,
        email,
        name,
        picture
      },
      created: true
    };
  }

  const existing = existingUsers[0];
  await pool.execute(
    'UPDATE users SET google_id = ?, name = ?, picture = ? WHERE id = ?',
    [googleId, name, picture, existing.id]
  );

  return {
    user: {
      ...existing,
      name,
      picture
    },
    created: false
  };
}

function buildAuthResponse(user) {
  const token = jwt.sign(
    { userId: user.id, email: user.email, googleId: user.google_id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture
    }
  };
}

// Google OAuth Routes
app.get('/auth/google', (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    prompt: 'consent'
  });
  res.json({ authUrl });
});

app.post('/auth/google/callback', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { user } = await syncGoogleUser(payload, { createIfMissing: false });
    const authResponse = buildAuthResponse(user);
    res.json(authResponse);
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(400).json({ error: error.message || 'Authentication failed' });
  }
});

async function verifyGoogleToken(idToken) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('Server configuration error: Google Client ID missing');
  }

  const verifyClient = new OAuth2Client(clientId);
  const ticket = await verifyClient.verifyIdToken({
    idToken,
    audience: clientId
  });

  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Invalid token payload');
  }

  return payload;
}

function handleTokenError(res, error) {
  console.error('Google token verification error:', error);
  console.error('Error details:', {
    message: error.message,
    code: error.code,
    stack: error.stack
  });

  let errorMessage = 'Token verification failed';
  if (typeof error.message === 'string') {
    if (error.message.includes('audience')) {
      errorMessage = 'Token audience mismatch. Please check Google Client ID configuration.';
    } else if (error.message.includes('expired')) {
      errorMessage = 'Token has expired. Please try signing in again.';
    } else if (error.message.includes('Invalid token payload')) {
      errorMessage = error.message;
    } else {
      errorMessage = error.message;
    }
  }

  res.status(400).json({ error: errorMessage });
}

// Login with Google token (existing accounts only)
app.post('/auth/google/verify', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    const payload = await verifyGoogleToken(token);
    const { user } = await syncGoogleUser(payload, { createIfMissing: false });
    res.json(buildAuthResponse(user));
  } catch (error) {
    handleTokenError(res, error);
  }
});

// Sign up with Google token (creates account if needed)
app.post('/auth/google/signup', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    const payload = await verifyGoogleToken(token);
    const { user } = await syncGoogleUser(payload, { createIfMissing: true });
    res.json(buildAuthResponse(user));
  } catch (error) {
    handleTokenError(res, error);
  }
});

// BMI Routes
app.post('/api/bmi', authenticateToken, async (req, res) => {
  try {
    const { height, weight, bmi } = req.body;
    const userId = req.user.userId;

    if (!height || !weight || !bmi) {
      return res.status(400).json({ error: 'Height, weight, and BMI are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO bmi_records (user_id, height, weight, bmi) VALUES (?, ?, ?, ?)',
      [userId, height, weight, bmi]
    );

    res.json({
      success: true,
      record: {
        id: result.insertId,
        height,
        weight,
        bmi,
        recorded_at: new Date()
      }
    });
  } catch (error) {
    console.error('Error saving BMI:', error);
    res.status(500).json({ error: 'Failed to save BMI record' });
  }
});

app.get('/api/bmi/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [records] = await pool.execute(
      'SELECT * FROM bmi_records WHERE user_id = ? ORDER BY recorded_at DESC',
      [userId]
    );

    res.json({ records });
  } catch (error) {
    console.error('Error fetching BMI history:', error);
    res.status(500).json({ error: 'Failed to fetch BMI history' });
  }
});

app.delete('/api/bmi/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    await pool.execute('DELETE FROM bmi_records WHERE user_id = ?', [userId]);

    res.json({ success: true, message: 'History cleared' });
  } catch (error) {
    console.error('Error clearing BMI history:', error);
    res.status(500).json({ error: 'Failed to clear BMI history' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Make sure MySQL is running and database is created!');
});

