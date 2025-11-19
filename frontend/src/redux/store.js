import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import teacherReducer from './slices/teacherSlice';
import dashboardReducer from './slices/dashboardSlice';
import lessonAnalysisReducer from './slices/lessonAnalysisSlice'; // Yangi

const store = configureStore({
  reducer: {
    auth: authReducer,
    teacher: teacherReducer,
    dashboard: dashboardReducer,
    lessonAnalysis: lessonAnalysisReducer, // Yangi
  },
});

export default store;