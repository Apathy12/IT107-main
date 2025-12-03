// Test MySQL database connection
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

async function testConnection() {
  console.log('🔍 Testing MySQL database connection...\n');

  // Check if .env exists
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    console.log('   Run: npm run setup');
    process.exit(1);
  }

  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'bmi_calculator',
  };

  console.log('📋 Configuration:');
  console.log(`   Host: ${config.host}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   Password: ${config.password ? '***' : '(empty)'}\n`);

  try {
    // Test connection
    const connection = await mysql.createConnection(config);
    console.log('✅ Successfully connected to MySQL!');

    // Check if database exists
    const [databases] = await connection.execute('SHOW DATABASES LIKE ?', [config.database]);
    if (databases.length === 0) {
      console.log(`\n⚠️  Database '${config.database}' does not exist.`);
      console.log('   Run: mysql -u root -p < database.sql');
    } else {
      console.log(`✅ Database '${config.database}' exists.`);

      // Check if tables exist
      await connection.execute(`USE ${config.database}`);
      const [tables] = await connection.execute('SHOW TABLES');
      
      if (tables.length === 0) {
        console.log('⚠️  No tables found in database.');
        console.log('   Run the CREATE TABLE statements from database.sql');
      } else {
        console.log(`✅ Found ${tables.length} table(s):`);
        tables.forEach(table => {
          console.log(`   - ${Object.values(table)[0]}`);
        });
      }
    }

    await connection.end();
    console.log('\n✅ Database connection test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error(`   Error: ${error.message}\n`);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Tips:');
      console.log('   - Make sure MySQL server is running');
      console.log('   - Check if MySQL is installed');
      console.log('   - Verify host and port in .env');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 Tips:');
      console.log('   - Check username and password in .env');
      console.log('   - Verify MySQL user has proper permissions');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 Tips:');
      console.log('   - Database does not exist');
      console.log('   - Run: mysql -u root -p < database.sql');
    }
    
    process.exit(1);
  }
}

testConnection();

