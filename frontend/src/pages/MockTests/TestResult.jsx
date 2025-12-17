import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Award,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Home,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axios';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import CountUp from 'react-countup';

const TestResult = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  const fetchResult = async () => {
    try {
      const response = await axiosInstance.get(`/mock-tests/attempt/${attemptId}/`);
      setResult(response.data);
    } catch (error) {
      toast.error('Natijani yuklab bo\'lmadi');
      navigate('/mock-tests');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!result) return null;

  const { attempt, questions } = result;

  // Xavfsizlik tekshiruvi
  if (!attempt || !questions) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Ma'lumotlar yuklanmadi</Typography>
      </Box>
    );
  }

  const passed = attempt.passed;
  const userAnswers = attempt.answers || {};

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: passed
          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Result Card */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Paper
            sx={{
              p: 6,
              mb: 4,
              textAlign: 'center',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 6,
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 3,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: passed ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                boxShadow: passed ? '0 10px 40px rgba(16,185,129,0.5)' : '0 10px 40px rgba(239,68,68,0.5)',
              }}
            >
              {passed ? <Award size={64} color="white" /> : <XCircle size={64} color="white" />}
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              {passed ? 'Tabriklaymiz!' : 'Yaxshiroq harakat qiling!'}
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.secondary', mb: 4 }}>
              Natija:{' '}
              <span style={{ color: passed ? '#10b981' : '#ef4444' }}>
                <CountUp end={attempt.score} duration={2} />%
              </span>
            </Typography>

            <Grid container spacing={3} sx={{ maxWidth: 600, mx: 'auto' }}>
              <Grid item xs={4}>
                <Card sx={{ bgcolor: 'success.light', color: 'success.dark' }}>
                  <CardContent>
                    <CheckCircle size={32} style={{ marginBottom: 8 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      <CountUp end={attempt.correct_answers} duration={2} />
                    </Typography>
                    <Typography variant="body2">To'g'ri</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={4}>
                <Card sx={{ bgcolor: 'error.light', color: 'error.dark' }}>
                  <CardContent>
                    <XCircle size={32} style={{ marginBottom: 8 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      <CountUp end={attempt.wrong_answers} duration={2} />
                    </Typography>
                    <Typography variant="body2">Noto'g'ri</Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={4}>
                <Card sx={{ bgcolor: 'info.light', color: 'info.dark' }}>
                  <CardContent>
                    <Clock size={32} style={{ marginBottom: 8 }} />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {Math.floor(attempt.time_spent / 60)}
                    </Typography>
                    <Typography variant="body2">Daqiqa</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={() => navigate('/mock-tests')}
                size="large"
              >
                Bosh sahifa
              </Button>
              <Button
                variant="contained"
                startIcon={<RotateCcw />}
                onClick={() => navigate(`/mock-tests/${attempt.test}/take`)}
                size="large"
              >
                Qayta topshirish
              </Button>
            </Box>
          </Paper>
        </motion.div>

        {/* Questions Review */}
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 3 }}>
          Savollarga javoblar
        </Typography>

        {questions.map((question, index) => {
          const userAnswer = userAnswers[String(question.id)] || userAnswers[question.id];
          const isCorrect = userAnswer === question.correct_answer;

          return (
            <Accordion key={question.id} sx={{ mb: 2, borderRadius: 3, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Chip
                    icon={isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    label={`Savol ${index + 1}`}
                    color={isCorrect ? 'success' : 'error'}
                  />
                  <Typography sx={{ flex: 1 }}>{question.question_text}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ pl: 2 }}>
                  {['A', 'B', 'C', 'D'].map((option) => {
                    const optionKey = `option_${option.toLowerCase()}`;
                    const optionText = question[optionKey] || '';
                    const isUserAnswer = userAnswer === option;
                    const isCorrectAnswer = question.correct_answer === option;

                    return (
                      <Box
                        key={option}
                        sx={{
                          p: 2,
                          mb: 1,
                          borderRadius: 2,
                          border: '2px solid',
                          borderColor: isCorrectAnswer ? 'success.main' : isUserAnswer ? 'error.main' : 'grey.300',
                          bgcolor: isCorrectAnswer ? 'success.light' : isUserAnswer ? 'error.light' : 'white',
                        }}
                      >
                        <Typography>
                          <strong>{option})</strong> {optionText}
                          {isCorrectAnswer && ' (To\'g\'ri javob)'}
                          {isUserAnswer && !isCorrectAnswer && ' (Sizning javobingiz)'}
                        </Typography>
                      </Box>
                    );
                  })}

                  {question.explanation && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
                        Tushuntirish:
                      </Typography>
                      <Typography variant="body2">{question.explanation}</Typography>
                    </Box>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Container>
    </Box>
  );
};

export default TestResult;