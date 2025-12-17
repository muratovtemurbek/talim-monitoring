import React, { useState } from 'react';
import {
  Container,
  Box,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Bot,
  User,
  Copy,
  FileText,
  BookOpen,
  MessageSquare,
  Sparkles,
  Check,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import PageHeader from '../../components/Common/PageHeader';
import axiosInstance from '../../api/axios';
import { toast } from 'react-toastify';

const AIAssistant = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // Lesson Plan state
  const [lessonForm, setLessonForm] = useState({
    subject: '',
    topic: '',
    grade: '',
    duration: '45',
  });
  const [lessonPlan, setLessonPlan] = useState('');

  // Test Generator state
  const [testForm, setTestForm] = useState({
    subject: '',
    topic: '',
    grade: '',
    count: '5',
    difficulty: 'medium',
  });
  const [testQuestions, setTestQuestions] = useState('');

  const subjects = [
    { value: 'math', label: 'Matematika' },
    { value: 'physics', label: 'Fizika' },
    { value: 'chemistry', label: 'Kimyo' },
    { value: 'biology', label: 'Biologiya' },
    { value: 'informatics', label: 'Informatika' },
    { value: 'english', label: 'Ingliz tili' },
    { value: 'uzbek', label: "O'zbek tili" },
    { value: 'russian', label: 'Rus tili' },
    { value: 'history', label: 'Tarix' },
    { value: 'geography', label: 'Geografiya' },
  ];

  // Chat Functions
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setMessages([...messages, userMessage]);
    setChatInput('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/ai/chat/', {
        message: chatInput,
      });

      const aiMessage = { role: 'assistant', content: response.data.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // Lesson Plan Functions
  const handleGenerateLessonPlan = async () => {
    if (!lessonForm.subject || !lessonForm.topic || !lessonForm.grade) {
      toast.error("Barcha maydonlarni to'ldiring!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/ai/lesson-plan/', lessonForm);
      setLessonPlan(response.data.lesson_plan);
      toast.success('Dars rejasi yaratildi!');
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // Test Generator Functions
  const handleGenerateTest = async () => {
    if (!testForm.subject || !testForm.topic || !testForm.grade) {
      toast.error("Barcha maydonlarni to'ldiring!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/ai/generate-test/', testForm);
      setTestQuestions(response.data.questions);
      toast.success('Test yaratildi!');
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Nusxalandi!');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
        pt: 4,
        pb: 6,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <PageHeader
          title="AI Yordamchi"
          subtitle="Sun'iy intellekt bilan ishlash"
          icon={Bot}
        />

        {/* Main Content */}
        <Paper
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
          }}
        >
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
            <Tabs
              value={tabValue}
              onChange={(e, v) => setTabValue(v)}
              sx={{ px: 2 }}
            >
              <Tab
                icon={<MessageSquare size={20} />}
                iconPosition="start"
                label="Suhbat"
                sx={{ fontWeight: 600 }}
              />
              <Tab
                icon={<BookOpen size={20} />}
                iconPosition="start"
                label="Dars Rejasi"
                sx={{ fontWeight: 600 }}
              />
              <Tab
                icon={<FileText size={20} />}
                iconPosition="start"
                label="Test Yaratish"
                sx={{ fontWeight: 600 }}
              />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {/* CHAT TAB */}
            {tabValue === 0 && (
              <Box>
                {/* Messages */}
                <Box
                  sx={{
                    height: '500px',
                    overflowY: 'auto',
                    mb: 2,
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 3,
                  }}
                >
                  {messages.length === 0 ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        gap: 2,
                      }}
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Bot size={64} color="#8b5cf6" />
                      </motion.div>
                      <Typography variant="h6" color="text.secondary">
                        Savol bering...
                      </Typography>
                    </Box>
                  ) : (
                    <AnimatePresence>
                      {messages.map((msg, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              gap: 2,
                              mb: 3,
                              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                            }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: msg.role === 'user' ? 'primary.main' : 'secondary.main',
                                width: 40,
                                height: 40,
                              }}
                            >
                              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                            </Avatar>
                            <Box
                              sx={{
                                flex: 1,
                                bgcolor: msg.role === 'user' ? 'primary.light' : 'white',
                                p: 2,
                                borderRadius: 3,
                                position: 'relative',
                              }}
                            >
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                              {msg.role === 'assistant' && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleCopy(msg.content)}
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                  }}
                                >
                                  <Copy size={16} />
                                </IconButton>
                              )}
                            </Box>
                          </Box>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}

                  {loading && (
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                        <Bot size={20} />
                      </Avatar>
                      <Box
                        sx={{
                          bgcolor: 'white',
                          p: 2,
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <CircularProgress size={16} />
                        <Typography variant="body2">Javob yozilmoqda...</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Input */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Savolingizni yozing..."
                    disabled={loading}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={loading || !chatInput.trim()}
                    sx={{
                      minWidth: 56,
                      height: 56,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    }}
                  >
                    <Send size={24} />
                  </Button>
                </Box>
              </Box>
            )}

            {/* LESSON PLAN TAB */}
            {tabValue === 1 && (
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Fan</InputLabel>
                      <Select
                        value={lessonForm.subject}
                        onChange={(e) => setLessonForm({ ...lessonForm, subject: e.target.value })}
                        label="Fan"
                      >
                        {subjects.map((sub) => (
                          <MenuItem key={sub.value} value={sub.value}>
                            {sub.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label="Sinf"
                      type="number"
                      value={lessonForm.grade}
                      onChange={(e) => setLessonForm({ ...lessonForm, grade: e.target.value })}
                      inputProps={{ min: 1, max: 11 }}
                      sx={{ width: 120 }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Mavzu"
                    value={lessonForm.topic}
                    onChange={(e) => setLessonForm({ ...lessonForm, topic: e.target.value })}
                  />

                  <TextField
                    label="Davomiyligi (daqiqa)"
                    type="number"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    inputProps={{ min: 15, max: 90 }}
                    sx={{ width: 200 }}
                  />

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} /> : <Sparkles />}
                    onClick={handleGenerateLessonPlan}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                      py: 1.5,
                    }}
                  >
                    {loading ? 'Yaratilmoqda...' : 'Dars Rejasi Yaratish'}
                  </Button>
                </Box>

                {lessonPlan && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Paper
                      sx={{
                        p: 3,
                        bgcolor: 'grey.50',
                        borderRadius: 3,
                        position: 'relative',
                      }}
                    >
                      <IconButton
                        onClick={() => handleCopy(lessonPlan)}
                        sx={{ position: 'absolute', top: 16, right: 16 }}
                      >
                        <Copy size={20} />
                      </IconButton>
                      <ReactMarkdown>{lessonPlan}</ReactMarkdown>
                    </Paper>
                  </motion.div>
                )}
              </Box>
            )}

            {/* TEST GENERATOR TAB */}
            {tabValue === 2 && (
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Fan</InputLabel>
                      <Select
                        value={testForm.subject}
                        onChange={(e) => setTestForm({ ...testForm, subject: e.target.value })}
                        label="Fan"
                      >
                        {subjects.map((sub) => (
                          <MenuItem key={sub.value} value={sub.value}>
                            {sub.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label="Sinf"
                      type="number"
                      value={testForm.grade}
                      onChange={(e) => setTestForm({ ...testForm, grade: e.target.value })}
                      inputProps={{ min: 1, max: 11 }}
                      sx={{ width: 120 }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Mavzu"
                    value={testForm.topic}
                    onChange={(e) => setTestForm({ ...testForm, topic: e.target.value })}
                  />

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Savollar soni"
                      type="number"
                      value={testForm.count}
                      onChange={(e) => setTestForm({ ...testForm, count: e.target.value })}
                      inputProps={{ min: 5, max: 30 }}
                      sx={{ width: 150 }}
                    />

                    <FormControl sx={{ width: 200 }}>
                      <InputLabel>Qiyinlik darajasi</InputLabel>
                      <Select
                        value={testForm.difficulty}
                        onChange={(e) => setTestForm({ ...testForm, difficulty: e.target.value })}
                        label="Qiyinlik darajasi"
                      >
                        <MenuItem value="easy">Oson</MenuItem>
                        <MenuItem value="medium">O'rtacha</MenuItem>
                        <MenuItem value="hard">Qiyin</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} /> : <FileText />}
                    onClick={handleGenerateTest}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                      py: 1.5,
                    }}
                  >
                    {loading ? 'Yaratilmoqda...' : 'Test Yaratish'}
                  </Button>
                </Box>

                {testQuestions && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Paper
                      sx={{
                        p: 3,
                        bgcolor: 'grey.50',
                        borderRadius: 3,
                        position: 'relative',
                      }}
                    >
                      <IconButton
                        onClick={() => handleCopy(testQuestions)}
                        sx={{ position: 'absolute', top: 16, right: 16 }}
                      >
                        <Copy size={20} />
                      </IconButton>
                      <ReactMarkdown>{testQuestions}</ReactMarkdown>
                    </Paper>
                  </motion.div>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AIAssistant;