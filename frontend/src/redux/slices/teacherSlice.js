import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

// O'qituvchi profili
export const fetchTeacherProfile = createAsyncThunk(
  'teacher/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/teachers/teachers/my_profile/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Faoliyatlar
export const fetchMyActivities = createAsyncThunk(
  'teacher/fetchActivities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/teachers/activities/my_activities/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const teacherSlice = createSlice({
  name: 'teacher',
  initialState: {
    profile: null,
    activities: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeacherProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeacherProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchTeacherProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyActivities.fulfilled, (state, action) => {
        state.activities = action.payload;
      });
  },
});

export default teacherSlice.reducer;