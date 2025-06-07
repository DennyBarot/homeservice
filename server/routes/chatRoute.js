import express from 'express';
import { isAuthenticated } from '../middleware/authenticate.js';
import { sendMessage, getMessages, getConversations, markMessagesRead } from '../controllers/chatController.js';

const router = express.Router();

router.post('/send/:receiverId', isAuthenticated, sendMessage);
router.get('/get-messages/:otherParticipantId', isAuthenticated, getMessages);
router.get('/conversations', isAuthenticated, getConversations);
router.post('/mark-read', isAuthenticated, markMessagesRead);

export default router;
