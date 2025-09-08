// Importing necessary modules and packages
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const cartRoutes = require("./routes/cart");
const contactRoutes = require("./routes/contact");
const noteRoutes = require("./routes/note");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

// Setting up port number
const PORT = process.env.PORT || 4000;

// Loading environment variables from .env file
dotenv.config();

// Connecting to database
database.connect();

// Debug: Log MongoDB models
console.log('MongoDB Models:', mongoose.modelNames());

// Import Contact model to ensure it's registered
require('./models/Contact');
console.log('After requiring Contact model:', mongoose.modelNames());

// Middlewares
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
// CORS configuration
const whitelist = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://skill-up-git-main-priya6.vercel.app',
  'https://skillup-0cox.onrender.com',
  'https://skill-up-priya6.vercel.app',
  'https://skill-up-priya6.vercel.app/*',
  'https://skill-up-priya6.vercel.app/api/v1/*',
  'https://skill-up-priya6.vercel.app/api/v1'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in the whitelist
    if (whitelist.some(domain => origin === domain || origin.startsWith(domain.replace('/*', '')))) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
  exposedHeaders: ['set-cookie', 'token'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
        abortOnLimit: true,
    })
);

// Connecting to cloudinary
cloudinaryConnect();

// Setting up routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/reach", contactRoutes);
app.use("/api/v1/notes", noteRoutes);

// Testing the server
// app.get("/", (req, res) => {
// 	return res.json({
// 		success: true,
// 		message: "Your server is up and running ...",
// 	});
// });

// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`);
});

// End of code.
