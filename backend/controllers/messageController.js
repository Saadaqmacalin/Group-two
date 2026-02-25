const Message = require('../models/message');

// @desc    Send a message
// @route   POST /api/messages
// @access  Public
const sendMessage = async (req, res) => {
  const { sender, email, subject, message } = req.body;

  try {
    const newMessage = await Message.create({
      sender,
      email,
      subject,
      message
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({});
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get message by ID
// @route   GET /api/messages/:id
// @access  Private/Admin
const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message) {
      res.json(message);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (message) {
      await Message.findByIdAndDelete(req.params.id);
      res.json({ message: 'Message removed' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getMessageById,
  deleteMessage
};
