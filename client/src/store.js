import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { axiosInstance } from './components/utilities/axiosInstance.js';
import { io } from 'socket.io-client';

const useUserStore = create((set, get) => ({
  isAuthenticated: false,
  userProfile: null,
  buttonLoading: false,
  socket: null,
  socketId: null,
  messages: [],
  currentConversationId: null,
  setCurrentConversationId: (conversationId) => set({ currentConversationId: conversationId }),

  initializeSocket: () => {
    const userProfile = get().userProfile;
    if (!userProfile) return;

    if (get().socket) {
      get().socket.disconnect();
    }

    const socket = io("http://localhost:5000", {
      query: {
        userId: userProfile._id,
      },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      set({ socketId: socket.id });
      console.log("Socket connected with id:", socket.id);
      console.log("User profile id:", get().userProfile?._id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("newMessage", (newMessage) => {
      set((state) => ({ messages: [...state.messages, newMessage] }));
    });

    set({ socket });
  },

  loginUser: async ({ email, password }) => {
    set({ buttonLoading: true });
    try {
      const response = await axiosInstance.post("/login", { email, password });
      set({
        isAuthenticated: true,
        userProfile: response.data.responseData.user,
        buttonLoading: false,
      });
      get().initializeSocket();
      toast.success("Login successful!");
    } catch (error) {
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      set({ buttonLoading: false });
    }
  },

  registerUser: async (formData) => {
    set({ buttonLoading: true });
    try {
      const response = await axiosInstance.post("/signup", formData);
      set({
        isAuthenticated: true,
        userProfile: response.data.responseData.newUser,
        buttonLoading: false,
      });
      get().initializeSocket();
      toast.success("Account created successfully!");
    } catch (error) {
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      set({ buttonLoading: false });
    }
  },

  getCurrentUser: async () => {
    set({ buttonLoading: true });
    try {
      const response = await axiosInstance.get("/me");
      set({
        isAuthenticated: true,
        userProfile: response.data.user,
        buttonLoading: false,
      });
      get().initializeSocket();
    } catch (error) {
      set({
        isAuthenticated: false,
        userProfile: null,
        buttonLoading: false,
      });
    }
  },

  logoutUser: async () => {
    set({ buttonLoading: true });
    try {
      await axiosInstance.post("/logout");
      if (get().socket) {
        get().socket.disconnect();
      }
      set({
        userProfile: null,
        isAuthenticated: false,
        buttonLoading: false,
        socket: null,
        socketId: null,
        messages: [],
      });
      localStorage.clear();
      toast.success("Logout successful!!");
    } catch (error) {
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      set({ buttonLoading: false });
    }
  },

  updateUserProfile: async (formData) => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const response = await axiosInstance.put('/user-profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data.success) {
        set({ userProfile: response.data.user });
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile.');
      }
    } catch (error) {
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
    }
  },

  sendMessage: async ({ receiverId, message, timeStamp }) => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const response = await axiosInstance.post(`/send/${receiverId}`, { message, timeStamp }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        toast.success('Message sent successfully!');
      } else {
        toast.error('Failed to send message.');
      }
    } catch (error) {
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
    }
  },

  getMessages: async (receiverId) => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      const response = await axiosInstance.get(`/get-messages/${receiverId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        return response.data.messages;
      } else {
        toast.error('Failed to fetch messages.');
        return null;
      }
    } catch (error) {
      const errorOutput = error?.response?.data?.errMessage || error.message;
      toast.error(errorOutput);
      return null;
    }
  },
}));

export default useUserStore;
