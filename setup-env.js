// Setup script to create .env file from template
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(__dirname, '.env');
const templatePath = path.join(__dirname, 'env.template');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env file already exists. Skipping creation.');
  console.log('   If you want to recreate it, delete .env first.');
  process.exit(0);
}

// Read template
if (!fs.existsSync(templatePath)) {
  console.error('❌ env.template file not found!');
  process.exit(1);
}

let envContent = fs.readFileSync(templatePath, 'utf8');

// Generate a new JWT secret
const jwtSecret = crypto.randomBytes(32).toString('hex');
envContent = envContent.replace(/JWT_SECRET=.*/, `JWT_SECRET=${jwtSecret}`);

// Write .env file
fs.writeFileSync(envPath, envContent, 'utf8');

console.log('✅ .env file created successfully!');
console.log('');
console.log('📝 Next steps:');
console.log('   1. Edit .env and add your MySQL credentials');
console.log('   2. Add your Google OAuth credentials');
console.log('   3. Run: npm start');

