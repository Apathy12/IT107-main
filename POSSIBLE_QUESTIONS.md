# Possible Questions - BMI Calculator System

This document contains possible questions (easy to hard) that could be asked about the BMI Calculator system with Google OAuth and MySQL.

---

## 📚 Table of Contents
1. [Easy Questions](#easy-questions)
2. [Medium Questions](#medium-questions)
3. [Hard Questions](#hard-questions)

---

## 🟢 Easy Questions

### General System Overview

1. **What is the purpose of this BMI Calculator system?**
   - Answer: It's a full-stack web application that allows users to calculate their Body Mass Index (BMI), track their BMI history over time, and authenticate using Google OAuth (Gmail only).

2. **What technologies are used in this system?**
   - Answer: Node.js, Express.js, MySQL, Google OAuth 2.0, JWT (JSON Web Tokens), HTML/CSS/JavaScript, Tailwind CSS.

3. **What is BMI and how is it calculated?**
   - Answer: BMI (Body Mass Index) is a measure of body fat based on height and weight. Formula: `BMI = weight (kg) / (height (m))²` or `BMI = weight / ((height/100)²)` when height is in centimeters.

4. **What are the BMI categories?**
   - Answer: Underweight (<18.5), Normal Range (18.5-24.9), Overweight (25-29.9), Obesity Class 1 (30-34.9), Obesity Class 2 (35-39.9), Obesity Class 3/Severe (≥40).

### Setup & Configuration

5. **What environment variables are required for this system?**
   - Answer: PORT, NODE_ENV, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, JWT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI.

6. **What is the default port for the server?**
   - Answer: Port 3000.

7. **What database name is used?**
   - Answer: `bmi_calculator`.

8. **What is the purpose of the `.env` file?**
   - Answer: It stores environment variables like database credentials, JWT secret, and Google OAuth credentials securely without hardcoding them in the source code.

9. **How do you start the development server?**
   - Answer: Run `npm start` or `npm run dev` (with auto-reload using nodemon).

### Authentication

10. **What authentication method does this system use?**
    - Answer: Google OAuth 2.0 with JWT tokens for session management.

11. **Why does the system only allow Gmail accounts?**
    - Answer: The system enforces Gmail-only authentication by checking if the email ends with `@gmail.com` and is verified.

12. **What is JWT and why is it used?**
    - Answer: JWT (JSON Web Token) is a secure way to transmit information between parties. It's used here to authenticate API requests after the user logs in with Google.

13. **How long is a JWT token valid?**
    - Answer: 7 days (as configured in `server.js`).

### Database

14. **What are the two main tables in the database?**
    - Answer: `users` table and `bmi_records` table.

15. **What information is stored in the users table?**
    - Answer: id, google_id, email, name, picture, created_at, updated_at.

16. **What information is stored in the bmi_records table?**
    - Answer: id, user_id, height, weight, bmi, recorded_at.

17. **What is a foreign key relationship?**
    - Answer: In this system, `bmi_records.user_id` references `users.id`, ensuring that BMI records belong to a valid user.

### Frontend

18. **What happens when a user calculates their BMI?**
    - Answer: The BMI is calculated, displayed on the screen, saved to the database, and the history is reloaded.

19. **Where is the authentication token stored on the frontend?**
    - Answer: In `localStorage` with the key `'token'`.

20. **What happens if a user tries to access the BMI calculator without being logged in?**
    - Answer: They are redirected to the login page.

---

## 🟡 Medium Questions

### System Architecture

21. **Explain the flow of Google OAuth authentication in this system.**
    - Answer: User clicks "Sign in with Google" → Frontend gets Google ID token → Sends token to `/auth/google/verify` or `/auth/google/signup` → Backend verifies token with Google → Backend checks/creates user in database → Backend generates JWT token → Frontend stores JWT token → User is authenticated.

22. **What is the difference between `/auth/google/verify` and `/auth/google/signup` endpoints?**
    - Answer: `/auth/google/verify` is for login (existing accounts only, `createIfMissing: false`), while `/auth/google/signup` creates a new account if it doesn't exist (`createIfMissing: true`).

23. **How does the `authenticateToken` middleware work?**
    - Answer: It extracts the JWT token from the `Authorization` header, verifies it using the JWT_SECRET, decodes the user information, and attaches it to `req.user`. If invalid or missing, it returns a 401/403 error.

24. **What is a connection pool in MySQL and why is it used?**
    - Answer: A connection pool maintains a set of database connections that can be reused. It's used here to improve performance by avoiding the overhead of creating new connections for each request.

### Database Operations

25. **What happens when a user is deleted from the users table?**
    - Answer: Due to `ON DELETE CASCADE` in the foreign key constraint, all BMI records associated with that user are automatically deleted.

26. **Why are indexes created on `google_id` and `email` in the users table?**
    - Answer: Indexes speed up queries when searching by these fields, which are frequently used for user lookups during authentication.

27. **What SQL query is used to fetch a user's BMI history?**
    - Answer: `SELECT * FROM bmi_records WHERE user_id = ? ORDER BY recorded_at DESC`

28. **How does the system prevent duplicate user accounts?**
    - Answer: The `users` table has UNIQUE constraints on both `google_id` and `email` columns, preventing duplicate entries.

### Security

29. **What security measures are implemented in this system?**
    - Answer: JWT token authentication, Google OAuth verification, Gmail-only restriction, email verification check, CORS configuration, environment variables for sensitive data, password hashing capability (bcryptjs included).

30. **Why should the `.env` file never be committed to version control?**
    - Answer: It contains sensitive information like database passwords, JWT secrets, and OAuth credentials that could compromise the system if exposed.

31. **How does the system verify that a Google token is legitimate?**
    - Answer: The backend uses Google's `OAuth2Client.verifyIdToken()` method, which verifies the token's signature, expiration, and audience (Client ID) with Google's servers.

32. **What is CORS and why is it enabled in this system?**
    - Answer: CORS (Cross-Origin Resource Sharing) allows the frontend (potentially on a different origin) to make requests to the backend API. It's enabled to allow API calls from the frontend.

### API Endpoints

33. **List all the API endpoints and their purposes.**
    - Answer:
      - `GET /auth/google` - Get Google OAuth URL
      - `POST /auth/google/callback` - Handle OAuth callback with code
      - `POST /auth/google/verify` - Verify Google token for login
      - `POST /auth/google/signup` - Sign up with Google token
      - `POST /api/bmi` - Save BMI record (requires auth)
      - `GET /api/bmi/history` - Get BMI history (requires auth)
      - `DELETE /api/bmi/history` - Clear BMI history (requires auth)
      - `GET /api/health` - Health check endpoint

34. **What HTTP status codes are returned in different scenarios?**
    - Answer: 200 (success), 400 (bad request), 401 (unauthorized - no token), 403 (forbidden - invalid token), 500 (server error).

35. **What happens if a user tries to save a BMI record without authentication?**
    - Answer: The `authenticateToken` middleware will return a 401 error with message "Access token required".

### Frontend Functionality

36. **How does the frontend handle authentication state?**
    - Answer: It checks `localStorage` for both `'token'` and `'loggedIn'` keys. If either is missing, the user is redirected to the login page.

37. **What validation is performed on height and weight inputs?**
    - Answer: Checks if values are numbers, greater than 0, and within realistic ranges (height: 50-250cm, weight: 10-300kg).

38. **How is BMI history displayed to the user?**
    - Answer: History is fetched from `/api/bmi/history`, sorted by most recent first, and displayed as a list with date, BMI, height, and weight.

39. **What happens when a user clicks "Reset History"?**
    - Answer: A confirmation dialog appears, and if confirmed, a DELETE request is sent to `/api/bmi/history` to clear all BMI records for that user.

### Error Handling

40. **How does the system handle database connection errors?**
    - Answer: Errors are caught in try-catch blocks, logged to console, and appropriate HTTP error responses (usually 500) are sent to the client.

41. **What happens if Google OAuth verification fails?**
    - Answer: The error is caught, logged, and a 400 error response is sent with a descriptive error message (e.g., "Token verification failed", "Token has expired", etc.).

42. **How does the system handle missing environment variables?**
    - Answer: The code uses default values (e.g., `process.env.PORT || 3000`) or throws errors if critical variables are missing (like Google Client ID).

---

## 🔴 Hard Questions

### Architecture & Design

43. **Explain the `syncGoogleUser` function and its purpose.**
    - Answer: This function synchronizes Google user data with the database. It checks if a user exists by `google_id` or `email`, creates a new user if `createIfMissing` is true, or updates existing user information (name, picture) if the user already exists. It also enforces Gmail-only accounts.

44. **Why is the `ensureGmailAccount` function separate from `syncGoogleUser`?**
    - Answer: Separation of concerns - it allows the Gmail validation logic to be reused and makes the code more maintainable and testable.

45. **What is the purpose of the `buildAuthResponse` function?**
    - Answer: It centralizes the creation of authentication responses, generating a JWT token and returning both the token and user information in a consistent format.

46. **How would you modify this system to support multiple authentication providers (Google, Facebook, GitHub)?**
    - Answer: Create an abstraction layer for authentication providers, implement provider-specific verification functions, add provider type to the users table, and modify the authentication endpoints to accept provider type.

### Database Optimization

47. **How would you optimize the database for a system with millions of BMI records?**
    - Answer: Add pagination to history queries, implement database partitioning by date, add composite indexes on (user_id, recorded_at), implement caching for frequently accessed data, consider archiving old records.

48. **What database indexes are currently missing that could improve performance?**
    - Answer: A composite index on `(user_id, recorded_at)` in `bmi_records` would optimize the history query that filters by user_id and orders by recorded_at.

49. **How would you implement soft deletes instead of hard deletes for BMI records?**
    - Answer: Add a `deleted_at` timestamp column, modify DELETE queries to UPDATE `deleted_at` instead, and filter out deleted records in SELECT queries.

### Security & Authentication

50. **What are the security vulnerabilities in the current implementation and how would you fix them?**
    - Answer: 
      - JWT stored in localStorage (vulnerable to XSS) → Use httpOnly cookies
      - No rate limiting → Implement rate limiting middleware
      - No token refresh mechanism → Implement refresh tokens
      - CORS allows all origins → Restrict to specific origins
      - No input sanitization → Add input validation/sanitization
      - JWT secret in .env template → Remove from template

51. **How would you implement token refresh functionality?**
    - Answer: Create a refresh token endpoint, store refresh tokens in database with expiration, issue short-lived access tokens (15min) and long-lived refresh tokens (7 days), implement token rotation.

52. **What is the difference between the OAuth flow using `/auth/google/callback` vs `/auth/google/verify`?**
    - Answer: `/auth/google/callback` uses the authorization code flow (exchanges code for tokens), while `/auth/google/verify` uses the ID token flow (frontend gets token directly from Google, backend verifies it).

53. **How would you implement role-based access control (RBAC) in this system?**
    - Answer: Add a `role` column to users table, include role in JWT payload, create role-checking middleware, implement different permissions for different roles.

### Scalability & Performance

54. **How would you make this system handle 10,000 concurrent users?**
    - Answer: Implement load balancing, use Redis for session storage, implement database read replicas, add caching layer, optimize database queries, use CDN for static assets, implement connection pooling (already done), add horizontal scaling.

55. **What caching strategies would you implement?**
    - Answer: Cache user information in Redis, cache BMI history with TTL, implement cache invalidation on updates, use browser caching for static assets.

56. **How would you implement real-time updates if multiple devices are calculating BMI for the same user?**
    - Answer: Use WebSockets (Socket.io) or Server-Sent Events (SSE) to push updates to all connected clients when a new BMI record is saved.

### Testing & Quality Assurance

57. **How would you write unit tests for the `syncGoogleUser` function?**
    - Answer: Mock the database pool, test cases: new user creation, existing user update, Gmail validation, non-Gmail rejection, email verification check.

58. **What integration tests would you write for the authentication flow?**
    - Answer: Test successful Google login, test Google signup, test invalid token rejection, test expired token handling, test Gmail-only restriction, test JWT generation.

59. **How would you test the BMI calculation accuracy?**
    - Answer: Create test cases with known inputs and expected outputs, test edge cases (very tall, very short, very heavy, very light), test decimal precision, test boundary values.

### Advanced Features

60. **How would you add a feature to export BMI history as PDF?**
    - Answer: Create a new endpoint `/api/bmi/export?format=pdf`, fetch user's BMI history, format data accordingly, use libraries like `pdfkit`, return file as download.

61. **How would you implement BMI goal setting and tracking?**
    - Answer: Add `goals` table with user_id, target_bmi, target_date, add endpoints to create/update goals, modify frontend to show progress toward goals, calculate progress percentage.

62. **How would you add social features like sharing BMI progress?**
    - Answer: Add sharing endpoints, implement privacy settings, create shareable links with tokens, add social media integration, implement friend/follow system.

63. **How would you implement data analytics and insights (BMI trends, predictions)?**
    - Answer: Calculate BMI trends over time, implement linear regression for predictions, create charts/graphs using Chart.js or D3.js, add insights like "You've lost X kg this month".

### Troubleshooting & Debugging

64. **A user reports they can't log in with their Gmail account. What are the possible causes?**
    - Answer: 
      - Email not verified by Google
      - Non-Gmail Google account (e.g., @company.com)
      - Google Client ID mismatch between frontend and backend
      - Token expired
      - Database connection issues
      - CORS issues
      - Google OAuth credentials not configured correctly

65. **The BMI history is not loading. How would you debug this?**
    - Answer: Check browser console for errors, verify JWT token is valid and not expired, check network tab for API response, verify database connection, check if user_id matches, verify SQL query execution, check for CORS issues.

66. **How would you implement comprehensive logging in this system?**
    - Answer: Use a logging library like Winston or Pino, log all API requests/responses, log authentication events, log database errors, implement log levels (info, warn, error), store logs in files or external service.

### Code Quality & Best Practices

67. **What code refactoring would you suggest to improve maintainability?**
    - Answer: 
      - Separate routes into different files (auth routes, BMI routes)
      - Create service layer for business logic
      - Extract database queries into repository pattern
      - Create middleware for error handling
      - Use environment-specific configuration files
      - Add input validation middleware (e.g., express-validator)
      - Implement consistent error response format

68. **How would you implement API versioning?**
    - Answer: Add version prefix to routes (e.g., `/api/v1/bmi`), create version-specific route handlers, maintain backward compatibility, document version changes.

69. **What improvements would you make to the frontend code?**
    - Answer: 
      - Use a frontend framework (React, Vue, Angular)
      - Implement proper state management
      - Add loading states and error handling
      - Improve accessibility (ARIA labels, keyboard navigation)
      - Add form validation feedback
      - Implement proper error messages
      - Add unit tests for JavaScript functions

### Deployment & DevOps

70. **How would you deploy this application to production?**
    - Answer: 
      - Use environment variables for production config
      - Set up HTTPS/SSL certificates
      - Use process manager (PM2)
      - Set up reverse proxy (Nginx)
      - Configure production database
      - Set up CI/CD pipeline
      - Implement monitoring and alerting
      - Set up backup strategy for database

71. **What environment-specific configurations would you need?**
    - Answer: Different database credentials, different Google OAuth redirect URIs, different CORS origins, different JWT secrets, different logging levels, different error message verbosity.

72. **How would you implement database migrations?**
    - Answer: Use a migration tool like `db-migrate` or `knex.js`, create migration files for schema changes, version control migrations, run migrations as part of deployment process.

### Advanced Database Concepts

73. **How would you implement data archiving for old BMI records?**
    - Answer: Create an `archived_bmi_records` table, create a scheduled job to move records older than X months, implement archive/restore functionality, maintain referential integrity.

74. **How would you implement full-text search for user names?**
    - Answer: Add FULLTEXT index on name column, use MATCH() AGAINST() queries, or implement Elasticsearch for advanced search capabilities.

75. **What database normalization issues exist, and how would you fix them?**
    - Answer: The current schema is already normalized. However, if adding more features, consider: separating user profiles from authentication, creating separate table for BMI categories, normalizing height/weight units.

---

## 🎯 Scenario-Based Questions

76. **A user wants to change their email address. How would you implement this feature?**
    - Answer: Add an endpoint to update email, verify new email with Google, update email in database, invalidate old JWT tokens, require re-authentication.

77. **How would you implement "Remember Me" functionality?**
    - Answer: Extend JWT expiration time, store refresh token in httpOnly cookie, implement token refresh endpoint, add checkbox in login form.

78. **How would you handle a situation where Google OAuth is temporarily unavailable?**
    - Answer: Implement fallback authentication method, cache user sessions, show user-friendly error messages, implement retry logic with exponential backoff.

79. **A user reports their BMI history disappeared. How would you investigate?**
    - Answer: Check database for records, verify user_id matches, check for accidental deletion, check database logs, implement audit trail for future, check for foreign key cascade issues.

80. **How would you implement multi-language support?**
    - Answer: Use i18n library, create translation files, detect user language, store language preference in database, translate all UI text and error messages.

---

## 📝 Notes

- These questions range from basic understanding to advanced implementation
- Some questions may have multiple valid answers
- Questions are designed to test both theoretical knowledge and practical problem-solving skills
- Consider the context and requirements when answering scenario-based questions

---

**Last Updated:** Generated for IT107 BMI Calculator System

