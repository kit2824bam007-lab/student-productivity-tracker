<<<<<<< HEAD
# Student Productivity Tracker 📊

A comprehensive web-based application designed to help students track and improve their productivity, monitor coding progress, manage courses, and analyze mobile usage patterns.

## Features ✨

### 📈 Dashboard
- Real-time productivity metrics and analytics
- Visual charts and graphs using Chart.js
- Complete student data overview
- Productivity scoring system

### 💻 Coding Progress Tracking
- **LeetCode Integration**: Sync LeetCode statistics automatically
- **CodeChef Integration**: Track CodeChef performance metrics
- **HackerRank Support**: Monitor HackerRank progress
- Problems solved, rankings, and streak tracking
- Real-time updates from coding platforms

### 📱 Mobile Usage Monitoring
- Track daily screen time
- Monitor productive vs. social app usage
- Productivity score based on app usage patterns
- Detailed app breakdown (productive and social categories)
- Historical data visualization (7-day history)

### 📚 Course Management
- Track enrolled courses
- Monitor course progress (0-100%)
- Mark courses as completed or in-progress
- Organize by domain/category
- Instructor information

### 🎓 Student Performance Analytics
- Academic metrics (CGPA, GPA)
- Enrollment status tracking
- Department and specialization information
- Complete student profile management

### 🔐 Authentication & Authorization
- Secure user login/registration
- JWT-based authentication
- Role-based access control (Student/Admin)
- Password encryption with bcryptjs

### 💬 AI Chat Integration
- Dataset-aware chatbot responses
- Real-time productivity insights
- Quick answers about coding stats, screen time, and courses
- Fallback to fixed responses when API unavailable

### 📊 Real-time Updates
- Socket.IO integration for live data streaming
- Real-time productivity updates
- Instant notifications and data synchronization
- Live chat messaging

## Tech Stack 🛠️

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time communication
- **MongoDB/Mongoose** - Database (with file-based fallback)
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Axios** - HTTP client for external APIs
- **Cheerio** - Web scraping

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling with modern layout
- **JavaScript (Vanilla)** - Interactivity
- **Chart.js** - Data visualization
- **Socket.IO Client** - Real-time updates
- **FontAwesome** - Icons

### External APIs
- **LeetCode API** - Coding practice statistics
- **CodeChef API** - Competitive programming data
- **Kaggle API** - Dataset imports (optional)

## Project Structure 📁

```
student-productivity-tracker/
├── server.js                 # Main server entry point
├── app.js                    # Express app configuration
├── database.js               # Database utilities
├── index.html                # Frontend UI
├── styles.css                # Styling
├── package.json              # Project dependencies
├── package-lock.json         # Dependency lock file
│
├── controllers/              # Business logic
│   ├── authController.js     # Authentication handlers
│   ├── studentController.js  # Student management
│   ├── adminController.js    # Admin operations
│   └── codingController.js   # Coding stats handlers
│
├── routes/                   # API endpoints
│   ├── auth.js               # Auth routes (/api/auth)
│   ├── students.js           # Student routes (/api/students)
│   ├── admin.js              # Admin routes (/api/admin)
│   ├── coding.js             # Coding routes (/api/coding)
│   ├── mobileUsage.js        # Mobile usage routes
│   ├── messageDeepSeek.js    # Chat routes
│   └── deepThinkSearch.js    # Search routes
│
├── middleware/               # Express middleware
│   ├── auth.js               # Authentication middleware
│   └── validation.js         # Input validation
│
├── models/                   # Database schemas
│   ├── Student.js            # Student model
│   ├── User.js               # User model
│   ├── Course.js             # Course model
│   └── Certificate.js        # Certificate model
│
├── utils/                    # Utility functions
│   ├── leetcode.js           # LeetCode API client
│   ├── codechef.js           # CodeChef API client
│   ├── datasetImporter.js    # Data import utilities
│   └── kaggleImporter.js     # Kaggle integration
│
├── chat_data/                # Chat data storage
├── data/                     # Datasets
│   └── student-mat.csv       # Student performance data
│
└── .env                      # Environment variables
```

## Installation 🚀

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd student-productivity-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string (optional)
OPENAI_API_KEY=your_openai_api_key (optional)
AUTO_IMPORT=true
IMPORT_LIMIT=100
```

4. **Start the server**
```bash
# Development (with nodemon)
npm run dev

# Production
npm start
```

5. **Access the application**
Open your browser and navigate to:
```
http://localhost:5001
```

## API Endpoints 📡

### Authentication Routes (`/api/auth`)
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Student Routes (`/api/students`)
- `GET /api/students/:id` - Get student profile
- `PUT /api/students/:id` - Update student profile
- `GET /api/students` - List all students (admin)

### Dashboard Routes (`/api/dashboard`)
- `GET /api/dashboard/:email` - Get complete dashboard data

### Coding Routes (`/api/realtime`)
- `POST /api/realtime/leetcode` - Fetch LeetCode stats
- `POST /api/realtime/codechef` - Fetch CodeChef stats

### Mobile Usage Routes (`/api/mobile-usage`)
- `POST /api/mobile-usage` - Log mobile usage
- `POST /api/mobile-usage/event` - Log app usage event
- `GET /api/mobile-usage/:email` - Get 7-day history

### AI Chat Routes (`/api/deepseek`)
- `POST /api/deepseek/message` - Send chat message
- `GET /api/deepseek/message` - Test endpoint

### Admin Routes (`/api/admin`)
- `GET /api/admin/users` - List all users
- `GET /api/admin/import-dataset` - Import UCI dataset
- `GET /api/admin/import-kaggle` - Import Kaggle dataset

## Usage Examples 💡

### Login & Get Dashboard Data
```javascript
// Login
POST /api/auth/login
{
  "email": "student@example.com",
  "password": "password123"
}

// Get Dashboard
GET /api/dashboard/student@example.com
```

### Track Mobile Usage
```javascript
POST /api/mobile-usage/event
{
  "email": "student@example.com",
  "appName": "LeetCode",
  "minutes": 45,
  "category": "productive"
}
```

### Get Coding Statistics
```javascript
POST /api/realtime/leetcode
{
  "email": "student@example.com",
  "username": "your_leetcode_username"
}
```

### Chat with AI
```javascript
POST /api/deepseek/message
{
  "email": "student@example.com",
  "message": "What's my productivity today?"
}
```

## Data Features 📊

### Auto-Generated Data
- The application automatically generates realistic student data on login
- Complete datasets include:
  - Student profiles with academic info
  - 7-day productivity metrics
  - Coding progress on multiple platforms
  - Course enrollment and progress
  - Mobile usage patterns
  - Event data

### Real-time Socket Events
- Student connects with email room ID
- Live data updates through socket events
- Dashboard refreshes automatically

## Security Features 🔒

- ✅ JWT token-based authentication
- ✅ bcryptjs password hashing
- ✅ CORS enabled for secure cross-origin requests
- ✅ Input validation and sanitization
- ✅ Rate limiting ready (can be added)
- ✅ Secure headers middleware

## Environment Variables 🔐

```env
PORT                 # Server port (default: 5001)
NODE_ENV            # Environment (development/production)
MONGODB_URI         # MongoDB connection string (optional)
OPENAI_API_KEY      # OpenAI API key for AI features (optional)
FIXED_AI_RESPONSE   # Fallback AI response
OPENAI_MODEL        # OpenAI model to use
AUTO_IMPORT         # Auto-import datasets on startup
IMPORT_LIMIT        # Dataset import size limit
```

## Running Tests 🧪

```bash
npm test
```

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Deployment 🌐

### Heroku Deployment
```bash
heroku create your-app-name
git push heroku main
heroku open
```

### Docker (Optional)
```bash
docker build -t student-tracker .
docker run -p 5001:5001 student-tracker
```

## Troubleshooting 🐛

### Socket.IO Connection Issues
- Ensure CORS is properly configured
- Check that server is running on correct port
- Verify Socket.IO client script is loaded

### API 404 Errors
- Verify route paths match API documentation
- Check request method (GET, POST, PUT, DELETE)
- Ensure Content-Type header is set to `application/json`

### Database Connection Issues
- Verify MongoDB connection string
- Check database credentials
- Ensure network access is allowed

## Performance Tips ⚡

- Enable caching for API responses
- Implement pagination for large datasets
- Use Socket.IO namespaces for better organization
- Optimize database queries with indexes
- Enable gzip compression in production

## License 📄

This project is licensed under the ISC License - see LICENSE file for details.

## Author ✍️

Created for Student Productivity Enhancement

## Support 💬

For issues, questions, or suggestions:
- Open an GitHub issue
- Check existing documentation
- Review API examples

## Roadmap 🗺️

- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Gamification and achievements
- [ ] Integration with more coding platforms
- [ ] Peer comparison features
- [ ] Productivity tips and recommendations
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Focus session timer

## Changelog 📝

### Version 1.0.0
- Initial release
- Authentication system
- Dashboard with real-time data
- Mobile usage tracking
- Coding platform integration
- AI chat integration

---

**Happy Tracking! Keep Improving Your Productivity! 🚀**
=======
# student-productivity-tracker
>>>>>>> eba62706e000ca213f6814a3081a4052a91e588c
