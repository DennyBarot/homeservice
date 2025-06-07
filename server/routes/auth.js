import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { register, login, logout, getCurrentUser, updateProfile ,getProvidersByCategory,getAllProviders } from '../controllers/authController.js';
import isAuthenticated from '../middleware/authenticate.js';

const router = express.Router();

const uploadDir = path.join(process.cwd(), 'server', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

router.post('/signup', register);
router.post('/login', login);

router.post('/logout', logout);

router.get('/me', isAuthenticated, getCurrentUser);

router.put('/user-profile', isAuthenticated, upload.single('profileImage'), updateProfile);

import { getProviderById } from '../controllers/authController.js';

router.get('/providers/:category', getProvidersByCategory);
router.get('/providers', getAllProviders);

import { rateProvider } from '../controllers/authController.js';


router.get('/provider/:id', getProviderById);
router.post('/provider/:id/rate', isAuthenticated, rateProvider);

export default router;
