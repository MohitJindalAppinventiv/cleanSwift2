import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardApi } from '@/api/dashboard/index';
import { DashboardStatsData } from '@/types/dashboard';

interface DashboardState {
  data: DashboardStatsData | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: DashboardState = {
  data: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getDashboardStats();
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue('Failed to fetch dashboard stats');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard data'
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;