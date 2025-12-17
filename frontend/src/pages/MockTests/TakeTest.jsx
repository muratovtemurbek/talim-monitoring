import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  CheckCircle,
  XCircle,
  Award,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axios';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && test) {
      handleSubmit(true);
    }
  }, [timeLeft]);

  const fetchTest = async () => {
    try {
      const response = await axiosInstance.get(`/mock-tests/${testId}/`);
      setTest(response.data);
      setTimeLeft(response.data.duration * 60);
    } catch (error) {
      toast.error('Test yuklanmadi');
      navigate('/mock-tests');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit) {
      setShowConfirm(true);
      return;
    }

    setSubmitting(true);
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    try {
      const response = await axiosInstance.post(`/mock-tests/${testId}/submit/`, {
        answers,
        time_spent: timeSpent,
      });

      toast.success(`Test yakunlandi! Natija: ${response.data.attempt.score}%`);
      navigate(`/mock-tests/result/${response.data.attempt.id}`);
    } catch (error) {
      toast.error('Xatolik yuz berdi');
    } finally {
      setSubmitting(false);
      setShowConfirm(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return (Object.keys(answers).length / (test?.questions?.length || 1)) * 100;
  };

  if (loading) return <LoadingSpinner />;
  if (!test) return null;

  const question = test.questions[currentQuestion];
  const isLastQuestion = currentQuestion === test.questions.length - 1;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          sx={{
            p: 3,
            mb: 3,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {test.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label={test.subject} color="primary" size="small" />
                <Chip label={test.difficulty} color="warning" size="small" />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 2,
                  borderRadius: 3,
                  bgcolor: timeLeft < 300 ? 'error.light' : 'primary.light',
                  color: 'white',
                }}
              >
                <Clock size={24} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {formatTime(timeLeft)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Savol {currentQuestion + 1}/{test.questions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Javob berildi: {Object.keys(answers).length}/{test.questions.length}
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={getProgress()} sx={{ height: 8, borderRadius: 4 }} />
          </Box>
        </Paper>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Paper
              sx={{
                p: 4,
                mb: 3,
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 4,
                minHeight: '400px',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                {currentQuestion + 1}. {question.question_text}
              </Typography>

              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                >
                  {['A', 'B', 'C', 'D'].map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio />}
                      label={
                        <Box sx={{ py: 1.5, px: 2 }}>
                          <Typography variant="body1">
                            <strong>{option})</strong> {question[`option_${option.toLowerCase()}`]}
                          </Typography>
                        </Box>
                      }
                      sx={{
                        mb: 2,
                        border: '2px solid',
                        borderColor: answers[question.id] === option ? 'primary.main' : 'grey.300',
                        borderRadius: 2,
                        bgcolor: answers[question.id] === option ? 'primary.light' : 'white',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'primary.light',
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Paper>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <Paper
          sx={{
            p: 3,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 4,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ChevronLeft />}
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Orqaga
            </Button>

            {isLastQuestion ? (
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => setShowConfirm(true)}
                disabled={submitting}
                sx={{ minWidth: 200 }}
              >
                Yakunlash
              </Button>
            ) : (
              <Button
                variant="contained"
                endIcon={<ChevronRight />}
                onClick={() => setCurrentQuestion(Math.min(test.questions.length - 1, currentQuestion + 1))}
              >
                Keyingi
              </Button>
            )}
          </Box>

          {/* Question Grid */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Savollar:
            </Typography>
            <Grid container spacing={1}>
              {test.questions.map((q, idx) => (
                <Grid item key={q.id}>
                  <Box
                    onClick={() => setCurrentQuestion(idx)}
                    sx={{
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 2,
                      cursor: 'pointer',
                      fontWeight: 700,
                      border: '2px solid',
                      borderColor: answers[q.id] ? 'success.main' : 'grey.300',
                      bgcolor: currentQuestion === idx ? 'primary.main' : answers[q.id] ? 'success.light' : 'white',
                      color: currentQuestion === idx ? 'white' : answers[q.id] ? 'success.dark' : 'text.secondary',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    {idx + 1}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Container>

      {/* Confirm Dialog */}
      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AlertCircle color="#f59e0b" />
            Testni yakunlashni xohlaysizmi?
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Javob berilgan savollar: {Object.keys(answers).length}/{test.questions.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Testni yakunlagandan keyin qaytib javob o'zgartira olmaysiz.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirm(false)}>Bekor qilish</Button>
          <Button variant="contained" color="success" onClick={() => handleSubmit(true)} disabled={submitting}>
            Ha, yakunlash
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TakeTest;