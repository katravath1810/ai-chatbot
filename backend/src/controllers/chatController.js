import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import Chat from '../models/Chat.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getUserId = (req) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    const userId = getUserId(req);

    let chat;
    if (chatId) {
      chat = await Chat.findById(chatId);
    }
    if (!chat) {
      chat = new Chat({ userId, title: message.slice(0, 30), messages: [] });
    }

    chat.messages.push({ role: 'user', content: message });

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: chat.messages.map(m => ({ role: m.role, content: m.content })),
    });

    const reply = response.choices[0].message.content;
    chat.messages.push({ role: 'assistant', content: reply });
    await chat.save();

    res.json({ reply, chatId: chat._id, title: chat.title });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

export const getChats = async (req, res) => {
  try {
    const userId = getUserId(req);
    const chats = await Chat.find({ userId }, 'title createdAt').sort({ createdAt: -1 });
    res.json(chats);
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
};

export const getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: 'Chat not found' });
    res.json(chat);
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
};

export const deleteChat = async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ message: 'Chat deleted' });
  } catch {
    res.status(500).json({ error: 'Server Error' });
  }
};
