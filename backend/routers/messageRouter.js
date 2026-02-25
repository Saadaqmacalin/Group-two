const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getMessageById,
  deleteMessage,
  updateMessageStatus
} = require('../controllers/messageController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(sendMessage)
  .get(protect, admin, getMessages);

router.route('/:id')
  .get(protect, admin, getMessageById)
  .put(protect, admin, updateMessageStatus)
  .delete(protect, admin, deleteMessage);

module.exports = router;
