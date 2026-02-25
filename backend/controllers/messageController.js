const Message = require('../models/message');


const sendMessage = async (req, res) => {
  const { sender, email, subject, message } = req.body;

  // Customer Waxoo awodaa inuu isku diwan galiyo Name, Email, Subject, Message
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


const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({});
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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
