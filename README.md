# SkillUp - Online Learning Platform

SkillUp is a full-stack online learning platform that provides users with access to various courses, interactive learning materials, and a seamless learning experience. The platform is built using modern web technologies and follows best practices for both frontend and backend development.

## 🚀 Features

- **User Authentication** - Secure signup and login with JWT
- **Course Management** - Browse, search, and enroll in courses
- **Interactive Learning** - Video lectures, quizzes, and assignments
- **Progress Tracking** - Monitor your learning progress
- **Payment Integration** - Secure payment processing with Razorpay
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (v18.3.1)
- **State Management**: Redux Toolkit, React Context API
- **Styling**: CSS Modules, Styled Components
- **UI Components**: Radix UI, Framer Motion
- **Routing**: React Router DOM (v7.8.1)
- **Form Handling**: React Hook Form
- **Charts**: Chart.js
- **Animations**: Framer Motion
- **Icons**: React Icons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Email Service**: Nodemailer
- **Payment Gateway**: Razorpay
- **Scheduling**: Node Schedule

### Development Tools
- **Package Manager**: npm
- **Bundler**: Vite
- **Linting**: ESLint
- **Code Formatting**: Prettier
- **Version Control**: Git

## 📁 Project Structure

```
skillup/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # Source code
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page components
│       ├── hooks/         # Custom React hooks
│       └── ...
├── server/                # Backend Node.js application
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── models/          # Database models
│   ├── routes/         # API routes
│   └── ...
├── data/                 # Static data files
└── assets/              # Images, logos, and other static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SkillUp
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   cd ..
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Create `.env` files in both `client` and `server` directories
   - Add the required environment variables (refer to `.env.example` files)

4. **Start the development server**
   ```bash
   # Run both client and server concurrently
   npm run dev
   ```

   This will start:
   - Frontend on `http://localhost:3000`
   - Backend on `http://localhost:5000`

## 🔒 Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
COOKIE_EXPIRE=30
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_email_password
SMTP_FROM_EMAIL=your_email@gmail.com
SMTP_FROM_NAME=SkillUp
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret
```

### Client (.env)
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_RAZORPAY_KEY=your_razorpay_key
```

## 📚 API Documentation

API documentation is available at `/api-docs` when the server is running.



## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- And all the amazing open-source libraries used in this project
