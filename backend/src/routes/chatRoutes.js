const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route for sending a message
router.post('/send', chatController.sendMessage);

// Route for receiving messages
router.get('/receive', chatController.receiveMessages);

module.exports = router;