import { adminLogin, logoutAPI } from "@/api/auth";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { create } from "domain";

interface User {
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: !!localStorage.getItem("authToken"),
  isLoading: false,
  error: null,
};

// Async thunk for login
// export const loginUser = createAsyncThunk<
//   string, // return type is token
//   { email: string; password: string },
//   { rejectValue: string }
// >("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
//   try {
//     const res = await adminLogin({ email, password });

//     if (!res.idToken) {
//       return rejectWithValue("Invalid response from server. No token found");
//     }
//     console.log("response in slice", res);

//     localStorage.setItem("authToken", res.idToken);
//     localStorage.setItem("refreshToken", res.refreshToken);
//     localStorage.setItem("sessionToken", res.sessionToken);
//     return res.idToken;
//   } catch (error) {
//     return rejectWithValue(
//       error instanceof Error ? error.message : "Login failed"
//     );
//   }
// });

export const loginUser = createAsyncThunk<
  string, // return type is token
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await adminLogin({ email, password });

    if (!res.idToken) {
      return rejectWithValue("Invalid response from server. No token found");
    }

    localStorage.setItem("authToken", res.idToken);
    localStorage.setItem("refreshToken", res.refreshToken);
    localStorage.setItem("sessionToken", res.sessionToken);
    return res.idToken;
  } catch (error: any) {
    // 👇 Pass backend error message

    if (error instanceof Error) {
      console.log("error in authSlice",error);
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Login failed. Please try again.");
  }
});


export const logoutUser = createAsyncThunk<
  string, // return type is token
  void,
  { rejectValue: string }
>("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    const res = await logoutAPI();

    console.log("response in slice", res);

    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("persist:root");
    return res;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Login failed"
    );
  }
});

// Check for saved user on app start
export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async () => {
    const savedUser = localStorage.getItem("authToken");
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    return null;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.error = null;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })

      // Check auth status cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// export const { } = authSlice.actions;
export default authSlice.reducer;
