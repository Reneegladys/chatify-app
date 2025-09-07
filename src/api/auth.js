import axios from "axios";

// Bas-URL för API:t
const BASE_URL = "https://chatify-api.up.railway.app";

// Skicka alltid med cookies (viktigt för CSRF)
axios.defaults.withCredentials = true;

// Skapa en axios-instans med bas-URL
export const api = axios.create({
  baseURL: BASE_URL,
});

// Lägg till interceptors för att automatiskt sätta Authorization-header med token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
    return await api.patch("/csrf");
  } catch (error) {
    console.error("Failed to get CSRF token", error);
    throw error;
  }
};

// Registrera ny användare
export const register = async (formData) => {
  await getCsrfToken();
  return api.post("/auth/register", formData);
};

// Logga in användare och få JWT-token
export const login = async (formData) => {
  await getCsrfToken();
  return api.post("/auth/token", formData);
};

// Hämta skyddad hemlig data (exempel)
export const fetchSecret = async () => {
  return api.get("/secret");
};

export default api;
