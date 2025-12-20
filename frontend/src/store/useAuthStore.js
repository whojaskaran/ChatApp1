// frontend/src/store/useAuthStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  // ✅ check authentication state
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // ✅ sign up
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      const user = res.data;
      set({ authUser: user });

      // store JWT for future requests
      if (user.token) localStorage.setItem("token", user.token);

      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  // ✅ login
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      const user = res.data;
      set({ authUser: user });

      if (user.token) localStorage.setItem("token", user.token);

      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // ✅ logout
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  },

  // ✅ update profile
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error in update profile:", error);
      toast.error(error?.response?.data?.message || "Update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // ✅ SOCKET CONNECTION
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("[SOCKET] No token found, skipping connection");
      return;
    }

    // disconnect any existing socket first
    const existingSocket = get().socket;
    if (existingSocket?.connected) existingSocket.disconnect();

    console.log("[SOCKET] Connecting with token:", token.slice(0, 20) + "...");

    const socket = io(BASE_URL, {
      auth: { token }, // ✅ send JWT to backend
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("[SOCKET] Connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("[SOCKET] connect_error:", err.message);
    });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const sock = get().socket;
    if (sock?.connected) {
      sock.disconnect();
      console.log("[SOCKET] Disconnected");
    }
  },
}));
