import { create } from "zustand";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  // ✅ fetch users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await api.get("/api/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.error("getUsers error:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // ✅ fetch messages
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await api.get(`/api/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("getMessages error:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // ✅ send message
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }

    try {
      const res = await api.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("sendMessage error:", error);
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  // ✅ realtime messages
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.warn("[CHAT] subscribeToMessages: no socket available");
      return;
    }

    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      const isFromSelectedUser =
        String(newMessage.senderId) === String(selectedUser._id);

      if (!isFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (socket) socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
