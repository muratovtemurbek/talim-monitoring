import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Upload,
  Download,
  FileText,
  Plus,
  Trash2,
  Edit,
} from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axios';
import * as XLSX from 'xlsx';
import PageHeader from '../../components/Common/PageHeader';

const MockTestManager = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const downloadTemplate = () => {
    // Excel template yaratish
    const template = [
      ['test_title', 'subject', 'difficulty', 'duration', 'passing_score', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'explanation'],
      ['Matematika Test 1', 'math', 'easy', 30, 60, '2 + 2 = ?', '3', '4', '5', '6', 'B', 'Oddiy qo\'shish amali'],
      ['Matematika Test 1', 'math', 'easy', 30, 60, '5 * 3 = ?', '15', '12', '18', '20', 'A', 'Ko\'paytirish amali'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');

    // Column widths
    ws['!cols'] = [
      { width: 20 }, // test_title
      { width: 15 }, // subject
      { width: 15 }, // difficulty
      { width: 10 }, // duration
      { width: 15 }, // passing_score
      { width: 40 }, // question_text
      { width: 30 }, // option_a
      { width: 30 }, // option_b
      { width: 30 }, // option_c
      { width: 30 }, // option_d
      { width: 15 }, // correct_answer
      { width: 40 }, // explanation
    ];

    XLSX.writeFile(wb, 'mock_test_template.xlsx');
    toast.success('Template yuklandi!');
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      toast.info(`Fayl tanlandi: ${uploadedFile.name}`);
    }
  };

  const uploadTests = async () => {
    if (!file) {
      toast.error('Iltimos, fayl tanlang!');
      return;
    }

    setLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log('Parsed data:', jsonData);

        // Group by test_title
        const testsMap = {};
        jsonData.forEach((row) => {
          const testTitle = row.test_title;
          if (!testsMap[testTitle]) {
            testsMap[testTitle] = {
              title: row.test_title,
              subject: row.subject,
              difficulty: row.difficulty,
              duration: parseInt(row.duration),
              passing_score: parseInt(row.passing_score),
              questions: [],
            };
          }

          testsMap[testTitle].questions.push({
            question_text: row.question_text,
            option_a: row.option_a,
            option_b: row.option_b,
            option_c: row.option_c,
            option_d: row.option_d,
            correct_answer: row.correct_answer.toUpperCase(),
            explanation: row.explanation || '',
          });
        });

        // Upload each test
        for (const testData of Object.values(testsMap)) {
          await axiosInstance.post('/mock-tests/import/', testData);
        }

        toast.success('Testlar muvaffaqiyatli yuklandi!');
        setFile(null);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Xatolik yuz berdi!');
    } finally {
      setLoading(false);
    }
  };

  const exportTests = async () => {
    try {
      const response = await axiosInstance.get('/mock-tests/export/');
      const tests = response.data;

      // Excel yaratish
      const rows = [
        ['test_title', 'subject', 'difficulty', 'duration', 'passing_score', 'question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'explanation']
      ];

      tests.forEach(test => {
        test.questions.forEach(question => {
          rows.push([
            test.title,
            test.subject,
            test.difficulty,
            test.duration,
            test.passing_score,
            question.question_text,
            question.option_a,
            question.option_b,
            question.option_c,
            question.option_d,
            question.correct_answer,
            question.explanation || '',
          ]);
        });
      });

      const ws = XLSX.utils.aoa_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Tests');

      ws['!cols'] = [
        { width: 20 }, { width: 15 }, { width: 15 }, { width: 10 }, { width: 15 },
        { width: 40 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 30 },
        { width: 15 }, { width: 40 }
      ];

      XLSX.writeFile(wb, `mock_tests_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Testlar export qilindi!');
    } catch (error) {
      toast.error('Export xatolik!');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', pt: 4, pb: 6 }}>
      <Container maxWidth="xl">
        <PageHeader
          title="Mock Testlar Boshqaruvi"
          subtitle="Testlarni import va export qiling"
          icon={FileText}
        />

        <Grid container spacing={3}>
          {/* Template Download */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Download size={64} color="#10b981" style={{ marginBottom: 16 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Template Yuklab Olish
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Excel template yuklab olib, testlarni to'ldiring
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Download />}
                  onClick={downloadTemplate}
                  fullWidth
                >
                  Template Yuklab Olish
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Upload Tests */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Upload size={64} color="#3b82f6" style={{ marginBottom: 16 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Testlarni Yuklash
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  To'ldirilgan Excel faylni yuklang
                </Typography>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="upload-file"
                />
                <label htmlFor="upload-file">
                  <Button variant="outlined" component="span" fullWidth sx={{ mb: 2 }}>
                    {file ? file.name : 'Fayl Tanlash'}
                  </Button>
                </label>
                <Button
                  variant="contained"
                  startIcon={<Upload />}
                  onClick={uploadTests}
                  disabled={!file || loading}
                  fullWidth
                >
                  {loading ? 'Yuklanmoqda...' : 'Yuklash'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Export Tests */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <FileText size={64} color="#f59e0b" style={{ marginBottom: 16 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Testlarni Export Qilish
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Barcha testlarni Excel ga export qiling
                </Typography>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<Download />}
                  onClick={exportTests}
                  fullWidth
                >
                  Export Qilish
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MockTestManager;