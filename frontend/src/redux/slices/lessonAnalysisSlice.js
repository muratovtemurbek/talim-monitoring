import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

// Barcha tahlillarni olish
export const fetchLessonAnalyses = createAsyncThunk(
  'lessonAnalysis/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/lesson-analysis/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Men bergan tahlillar
export const fetchMyAnalysesGiven = createAsyncThunk(
  'lessonAnalysis/fetchGiven',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/lesson-analysis/my_analyses_given/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Menga berilgan tahlillar
export const fetchMyAnalysesReceived = createAsyncThunk(
  'lessonAnalysis/fetchReceived',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/lesson-analysis/my_analyses_received/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Kutilayotgan tahlillar
export const fetchPendingAnalyses = createAsyncThunk(
  'lessonAnalysis/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/lesson-analysis/pending/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Statistika
export const fetchAnalysisStats = createAsyncThunk(
  'lessonAnalysis/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/lesson-analysis/statistics/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const lessonAnalysisSlice = createSlice({
  name: 'lessonAnalysis',
  initialState: {
    analyses: [],
    givenAnalyses: [],
    receivedAnalyses: [],
    pendingAnalyses: [],
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessonAnalyses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLessonAnalyses.fulfilled, (state, action) => {
        state.loading = false;
        state.analyses = action.payload;
      })
      .addCase(fetchLessonAnalyses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyAnalysesGiven.fulfilled, (state, action) => {
        state.givenAnalyses = action.payload;
      })
      .addCase(fetchMyAnalysesReceived.fulfilled, (state, action) => {
        state.receivedAnalyses = action.payload;
      })
      .addCase(fetchPendingAnalyses.fulfilled, (state, action) => {
        state.pendingAnalyses = action.payload;
      })
      .addCase(fetchAnalysisStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { clearError } = lessonAnalysisSlice.actions;
export default lessonAnalysisSlice.reducer;