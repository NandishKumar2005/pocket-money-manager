# 💰 Pocket Money Manager

A comprehensive personal finance management application built with React.js and Node.js. Track your income, expenses, and gain valuable insights into your spending habits with beautiful charts and analytics.

![Pocket Money Manager](https://img.shields.io/badge/React-19.1.1-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![Vite](https://img.shields.io/badge/Vite-7.1.7-purple)

### ✨ Features

### 🎨 Modern UI/UX
- **Dark & Light Mode**: Seamless theme switching with beautiful color palettes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Engaging transitions and hover effects
- **Intuitive Navigation**: Clean sidebar navigation with active state indicators

### 📊 Dashboard
- **Financial Overview**: Real-time balance, income, and expense summaries
- **Interactive Charts**: Visual representation of monthly trends and category breakdowns
- **Recent Transactions**: Quick access to your latest financial activities
- **AI Investment Advisor**: Personalized investment suggestions based on your transactions

### 💳 Transaction Management
- **Add/Edit/Delete**: Full CRUD operations for transactions
- **Smart Filtering**: Filter by date range, type, and category
- **Search Functionality**: Find transactions quickly with real-time search
- **Category Management**: Predefined categories for better organization

### 📈 Analytics & Reports
- **Multiple Chart Types**: Line charts, bar charts, pie charts, and area charts
- **Time Range Selection**: Analyze data over different periods
- **Category Breakdown**: Detailed spending analysis by category
- **AI Spending Analysis**: AI-powered insights on your spending patterns
- **Export Functionality**: Download reports as PDF, CSV, Excel, Word

### 🤖 AI Features (Powered by OpenRouter)
- **PocketPal Chatbot**: Ask questions about the app and personal finance
- **AI Investment Advisor**: Get personalized investment advice based on your data
- **AI Spending Analysis**: Understand your spending habits with AI insights

### 🔐 Authentication & Security
- **User Registration & Login**: Secure authentication system
- **JWT Tokens**: Stateless authentication
- **Protected Routes**: Secure access to authenticated features
- **Password Hashing**: bcrypt encryption for password security

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Pocket_Money_Manager
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend-code
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Start the Application**
   
   **Terminal 1 - Backend Server:**
   ```bash
   cd backend
   npm start
   # or for development with auto-reload
   npm run dev
   ```
   
   **Terminal 2 - Frontend Server:**
   ```bash
   cd frontend-code
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## 🏗️ Project Structure

```
Pocket_Money_Manager/
├── backend/                 # Node.js/Express API
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication & error handling
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   └── server.js          # Express server
├── frontend-code/          # React.js Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts (Auth, Theme)
│   │   ├── services/      # API service layer
│   │   └── App.jsx        # Main app component
│   └── public/            # Static assets
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Recharts** - Beautiful, responsive charts
- **Lucide React** - Modern icon library
- **Axios** - HTTP client for API calls
- **CSS Variables** - Dynamic theming system
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-async-handler** - Async error handling

### AI
- **OpenRouter** - Free AI gateway (https://openrouter.ai)
- **nvidia/nemotron-3.5-super-vl:free** - Primary free model with fallbacks
- **Vercel Serverless Function** - Proxies AI calls server-side (key never exposed)

## 🎨 Design System

### Color Palette
- **Primary**: #3b82f6 (Blue)
- **Secondary**: #8b5cf6 (Purple)
- **Success**: #10b981 (Green)
- **Danger**: #ef4444 (Red)
- **Warning**: #f59e0b (Orange)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Cards**: Subtle shadows with hover effects
- **Buttons**: Multiple variants with smooth transitions
- **Forms**: Clean inputs with focus states
- **Charts**: Responsive with hover tooltips

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user
- `GET /api/users` - Get all users (admin)

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create transaction
- `PATCH /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables in your hosting platform
2. Ensure MongoDB Atlas allows connections from your hosting IP
3. Deploy the backend directory

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Update API URLs in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)




**Made with ❤️ for better financial management**
