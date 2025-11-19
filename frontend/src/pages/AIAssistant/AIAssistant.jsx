import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  IconButton,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  SmartToy,
  Send,
  Person,
} from '@mui/icons-material';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/ai/ask/', {
        message: input,
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Xatolik:', error);
      toast.error('AI javob berishda xatolik');

      const errorMessage = {
        role: 'assistant',
        content: 'Kechirasiz, xatolik yuz berdi. Keyinroq qayta urinib ko\'ring.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
          <SmartToy sx={{ mr: 1, color: 'primary.main' }} />
          AI Yordamchisi
        </Typography>
        <Typography variant="body2" color="textSecondary">
          O'quv jarayoni bo'yicha savollaringizni bering
        </Typography>
      </Box>

      <Paper sx={{ height: '60vh', display: 'flex', flexDirection: 'column' }}>
        {/* Messages */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {messages.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <SmartToy sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                Salom! Men sizga qanday yordam bera olaman?
              </Typography>
            </Box>
          )}

          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 2,
              }}
            >
              {message.role === 'assistant' && (
                <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                  <SmartToy />
                </Avatar>
              )}

              <Paper
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  bgcolor: message.role === 'user' ? 'primary.main' : 'grey.100',
                  color: message.role === 'user' ? 'white' : 'text.primary',
                }}
              >
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 1 }}>
                  {message.timestamp.toLocaleTimeString('uz-UZ')}
                </Typography>
              </Paper>

              {message.role === 'user' && (
                <Avatar sx={{ bgcolor: 'secondary.main', ml: 1 }}>
                  <Person />
                </Avatar>
              )}
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                <SmartToy />
              </Avatar>
              <Paper sx={{ p: 2 }}>
                <CircularProgress size={20} />
              </Paper>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              placeholder="Savolingizni yozing..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              sx={{ alignSelf: 'flex-end' }}
            >
              <Send />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AIAssistant;