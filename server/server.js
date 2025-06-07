import { config } from "dotenv";
import express from 'express';
import { connectDB } from "./db/connectdb.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from 'path';

import bodyParser from 'body-parser';
import http from 'http';

config();
import authRoutes from './routes/auth.js'; // Adjust the path as necessary
import chatRoutes from './routes/chatRoute.js';
import bookingRoutes from './routes/bookingRoutes.js';
import { initializeSocket, getSocketId } from './socket/socket.js';

const app = express();

// Enable CORS for all routes

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
// Increase JSON body size limit to 10mb
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json());
app.use(cookieParser());

// Serve uploads directory as static files
app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'uploads')));

connectDB().catch(err => {
  console.error("Database connection failed:", err);
  process.exit(1); // Exit the process if the connection fails
});

const server = http.createServer(app);

initializeSocket(server);

app.set('getSocketId', getSocketId);

//routes
app.use('/api', authRoutes);
app.use('/api', chatRoutes);
app.use('/api/booking', bookingRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`your server listening at port ${PORT}`);
});
