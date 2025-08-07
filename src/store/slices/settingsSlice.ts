import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { axiosInstance } from '@/api/axios/axiosInstance';
import API from '@/api/endpoints/endpoint';
import { RootState } from '..';

// Define the profile interface
interface Profile {
  uid: string;
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  emailVerified: boolean;
  lastSignInTime?: string;
}

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// Async thunk for fetching profile
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${API.GET_PROFILE()}`);
      console.log("Profile response",response);
      if (response.data.success) {
        return response.data.profile;
      }
      return rejectWithValue('Failed to fetch profile');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load profile');
    }
  }
);

// Async thunk for updating phone number
export const updatePhoneNumber = createAsyncThunk(
  'profile/updatePhoneNumber',
  async (newPhoneNumber: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${API.UPDATE_PHONE_NUMBER()}`, { 
        newPhoneNumber 
      });
      return newPhoneNumber; // Return the new phone number on success
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update phone number'
      );
    }
  }
);

// Async thunk for updating password
export const updatePassword = createAsyncThunk(
  'profile/updatePassword',
  async (
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post(`${API.UPDATE_PASSWORD()}`, {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update password'
      );
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<Profile>) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    
    // Update Phone Number
    builder
      .addCase(updatePhoneNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePhoneNumber.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        // Update only the phone number in the existing profile
        if (state.profile) {
          state.profile.phoneNumber = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePhoneNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
    
    // Update Password
    builder
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Password update doesn't change profile data, just clear any errors
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearProfile } = profileSlice.actions;

// Selectors
export const selectProfile = (state:RootState) =>state.settings.profile;
export const selectProfileLoading = (state:RootState) => state.settings.loading;
export const selectProfileError = (state: RootState) => state.settings.error;

export default profileSlice.reducer;