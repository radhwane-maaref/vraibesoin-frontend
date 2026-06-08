import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/services/api";

export const useAuthStore = defineStore("auth", () => {
  // --- State ---
  const user = ref(JSON.parse(localStorage.getItem("user_profile")) || null);
  const isAuthenticated = ref(!!localStorage.getItem("access_token"));
  const loading = ref(false);
  const error = ref(null);

  // Variable to keep track of any active, ongoing profile request
  let profilePromise = null;

  // --- Getters ---
  const getUser = computed(() => user.value);
  const getAuthStatus = computed(() => isAuthenticated.value);

  const handleAuthSuccess = (response) => {
    const { access, refresh } = response.data.tokens;
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    isAuthenticated.value = true;
    if (response.data.user) {
      user.value = response.data.user;
      localStorage.setItem("user_profile", JSON.stringify(response.data.user));
    }
    fetchUserProfile().catch(console.error);
  };

  // --- Actions ---
  const login = async (credentials) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post("/auth/login/", credentials);
      handleAuthSuccess(response);
    } catch (err) {
      error.value = err.response?.data?.error || "L'authentification a échoué.";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const register = async (userData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post("/auth/register/", userData);
      handleAuthSuccess(response);
    } catch (err) {
      const data = err.response?.data;
      error.value =
        data?.error ||
        data?.email?.[0] ||
        data?.password?.[0] ||
        data?.confirm_password?.[0] ||
        data?.non_field_errors?.[0] ||
        "L'inscription a échoué. Veuillez vérifier vos informations.";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const googleLogin = async (token) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post("/auth/google/", { token: token });
      handleAuthSuccess(response);
    } catch (err) {
      const backendError =
        err.response?.data?.non_field_errors?.[0] || err.response?.data?.error;
      error.value = backendError;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetches the user profile from the API.
   * Optimized with a request-collapsing lock mechanism to prevent duplicate storms.
   */
  const fetchUserProfile = async () => {
    // 1. If a profile request is already in-flight, return the existing promise
    if (profilePromise) return profilePromise;

    // 2. Initialize and store the single source-of-truth request promise
    profilePromise = (async () => {
      try {
        const response = await api.get("/users/me/");
        user.value = response.data;
        localStorage.setItem("user_profile", JSON.stringify(response.data));
        return response.data;
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        throw err;
      } finally {
        // 3. Clear out the promise variable once it completes or fails
        profilePromise = null;
      }
    })();

    return profilePromise;
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    error.value = null;
    profilePromise = null; // Reset the locking promise reference
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_profile");
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    getUser,
    getAuthStatus,
    login,
    googleLogin,
    register,
    fetchUserProfile,
    logout,
  };
});
