
# Stock Account Management System

A comprehensive stock account management system with React frontend and MySQL backend.

## Project Structure

```
project-root/
├── frontend/                 # React frontend (current Lovable project)
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/                  # Node.js/Express backend (to be created)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── package.json
│   └── server.js
└── database/
    └── schema.sql           # MySQL database schema
```

## Prerequisites

- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)
- **MySQL Workbench** (for database management)
- **Git** (for version control)

## Backend Setup Instructions

### 1. Create Backend Directory Structure

```bash
# Navigate to your project root
cd your-project-root

# Create backend directory
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express mysql2 cors dotenv bcryptjs jsonwebtoken helmet morgan
npm install -D nodemon concurrently
```

### 2. Database Setup

#### Step 1: MySQL Workbench Connection
1. Open MySQL Workbench
2. Create new connection with these details:
   - **Connection Name**: StockAcc_Local
   - **Hostname**: 127.0.0.1
   - **Port**: 3306
   - **Username**: root
   - **Password**: [your-mysql-password]

#### Step 2: Create Database Schema
Execute the provided SQL schema in MySQL Workbench:

```sql
-- Your provided schema here
CREATE SCHEMA `stockacc_db`;
-- [Include all your CREATE TABLE statements]
```

### 3. Backend Environment Configuration

Create `.env` file in backend directory:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=stockacc_db

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 4. Backend Code Implementation

#### Package.json Scripts
Update your backend `package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### 5. Running the Application

#### Start Backend Server:
```bash
cd backend
npm run dev
```

#### Start Frontend (in separate terminal):
```bash
cd frontend  # or wherever your Lovable project is
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Profile
- `GET /api/users/profile/:accId` - Get user profile
- `PUT /api/users/profile/:accId` - Update user profile
- `DELETE /api/users/profile/:accId` - Delete user profile

### Banking
- `POST /api/banking/verify-account` - Verify bank account
- `GET /api/banking/bank-options` - Get available banks
- `GET /api/banking/branch-options/:bankId` - Get bank branches

## Database Schema Overview

### Tables:
1. **personal_data** - Main user information
2. **bank_details** - Bank account information
3. **source_of_funding** - Funding source details
4. **contact_person_details** - Contact information
5. **role_of_contact** - Contact relationships

### Key Relationships:
- `personal_data` → `source_of_funding` (Funding_ID)
- `personal_data` → `bank_details` (Bank_Acc_No)
- `role_of_contact` → `personal_data` (Acc_ID)
- `role_of_contact` → `contact_person_details` (Contact_ID)

## Testing the Integration

### 1. Test Database Connection
```bash
# In backend directory
node -e "require('./src/config/database.js').testConnection()"
```

### 2. Test API Endpoints
Use Postman or curl to test:

```bash
# Test server health
curl http://localhost:3001/api/health

# Test registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"personalData":{"P_Name":"Test User"},...}'
```

### 3. Frontend Integration
1. Ensure backend is running on port 3001
2. Start frontend on port 5173
3. Test registration flow
4. Test login functionality
5. Verify data persistence in MySQL Workbench

## Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check MySQL service is running
   - Verify connection credentials in `.env`
   - Ensure database `stockacc_db` exists

2. **CORS Errors**
   - Verify `FRONTEND_URL` in `.env`
   - Check CORS middleware configuration

3. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings

4. **Port Conflicts**
   - Ensure ports 3001 (backend) and 5173 (frontend) are available
   - Change ports in configuration if needed

## Quality Assurance Checklist

### Before Sharing with Team:

- [ ] Database schema created successfully
- [ ] Backend server starts without errors
- [ ] Frontend connects to backend
- [ ] Registration process works end-to-end
- [ ] Login functionality works
- [ ] Data saves to MySQL database
- [ ] All API endpoints respond correctly
- [ ] Error handling works properly
- [ ] Environment variables configured
- [ ] Documentation is complete

## Team Setup Instructions

### For New Team Members:

1. **Clone Repository**
   ```bash
   git clone [your-repo-url]
   cd [project-name]
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your database settings
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Setup Database**
   - Install MySQL Workbench
   - Create connection to local MySQL
   - Run provided schema script
   - Verify tables are created

## Security Considerations

- Always use environment variables for sensitive data
- Implement proper input validation
- Use HTTPS in production
- Regularly update dependencies
- Implement rate limiting
- Use proper error handling without exposing sensitive information

## Next Steps

1. Implement additional business logic as needed
2. Add comprehensive error handling
3. Implement logging system
4. Add unit and integration tests
5. Setup CI/CD pipeline
6. Configure production environment
7. Add data backup and recovery procedures

