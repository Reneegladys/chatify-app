import axios from "axios";

// Bas-URL för API:t
const BASE_URL = "https://chatify-api.up.railway.app";

axios.defaults.withCredentials = true;

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Hämta CSRF-token innan skyddade POST-anrop
export const getCsrfToken = async () => {
  try {
    const res = await api.patch("/csrf");
    const { csrfToken } = res.data;
    if (csrfToken) {
      localStorage.setItem("csrfToken", csrfToken);
    }
    return csrfToken;
  } catch (error) {
    console.error("Failed to get CSRF token", error);
    throw error;
  }
};

export const register = async (formData) => {
  await getCsrfToken();
  return api.post("/auth/register", formData);
};

export const login = async (formData) => {
  await getCsrfToken();
  return api.post("/auth/token", formData);
};

export const fetchSecret = async () => {
  return api.get("/secret");
};

export default api;