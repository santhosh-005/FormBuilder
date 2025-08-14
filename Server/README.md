# Form Builder Server

A Node.js/Express server with MongoDB for the Form Builder application.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables in `.env`:**
   ```env
   # MongoDB - Choose one:
   MONGODB_URI=mongodb://localhost:27017/formbuilder  # Local MongoDB
   # OR
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/formbuilder  # MongoDB Atlas

   # Server settings
   PORT=3000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   ```

### MongoDB Setup Options

#### Option 1: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

#### Option 2: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a cluster
3. Get connection string and update `MONGODB_URI`

### Running the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## 📚 API Endpoints

### Forms
- `GET /api/forms` - Get all forms (with pagination)
- `POST /api/forms` - Create new form
- `GET /api/forms/:id` - Get specific form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form

### Submissions
- `POST /api/forms/:id/submissions` - Submit form
- `GET /api/forms/:id/submissions` - Get form submissions

### Uploads
- `POST /api/uploads` - Upload image
- `DELETE /api/uploads` - Delete image
- `GET /api/uploads/status` - Upload service status

### Health Check
- `GET /health` - Server health status

## 🏗️ Project Structure

```
server/
├── controllers/         # Request handlers
│   ├── formController.js
│   └── uploadController.js
├── models/             # Database models
│   ├── Form.js
│   └── Submission.js
├── routes/             # API routes
│   ├── forms.js
│   └── uploads.js
├── utils/              # Utility functions
│   └── validateForm.js
├── .env.example        # Environment template
├── .env               # Environment variables (create this)
├── package.json
└── server.js          # Main server file
```

## 🔧 Features

- ✅ MongoDB integration with Mongoose
- ✅ Form validation
- ✅ CORS configuration
- ✅ Error handling
- ✅ Request logging
- ✅ Graceful shutdown
- ✅ Health check endpoints
- ✅ Pagination support
- ✅ Search functionality

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
# Windows
sc query MongoDB

# macOS/Linux
ps aux | grep mongo
```

### Port Already in Use
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Image Upload Not Working
1. Check server logs for specific error messages

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | ✅ | `mongodb://localhost:27017/formbuilder` |
| `PORT` | Server port | ❌ | `3000` |
| `NODE_ENV` | Environment mode | ❌ | `development` |
| `CLIENT_URL` | Frontend URL for CORS | ❌ | `http://localhost:5173` |
