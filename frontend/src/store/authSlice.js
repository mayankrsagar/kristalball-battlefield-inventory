import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { token: localStorage.getItem("token"), user: null },
  reducers: {
    setCredentials: (state, { payload: { token } }) => {
      state.token = token;
      // atob will decode it from base64 to string
      const payload = JSON.parse(atob(token.split(".")[1]));
      state.user = {
        id: payload.id,
        role: payload.role,
        baseId: payload.baseId,
      };
      localStorage.setItem("token", token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
