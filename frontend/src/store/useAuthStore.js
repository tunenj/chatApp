import { create } from 'zustand';
import { axiosInstance } from '../lib/axios';
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in authCheck:", error);
            set({ authUser: null });

        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            // Send signup request
            const res = await axiosInstance.post("/auth/signup", data);

            // Save the user info in global state
            set({ authUser: res.data });

            // Show success notification
            toast.success("Account created successfully!");
        } catch (error) {
            // Handle any backend error message
            toast.error(error.response.data.message);
        } finally {
            // Always turn off loading state
            set({ isSigningUp: false });
        }
    }

}));