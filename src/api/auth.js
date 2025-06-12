import axios from "axios";

const BASE_URL = "https://chatify-api.up.railway.app";

axios.defaults.withCredentials = true;

export const getCsrfToken = async () => {
  await axios.patch(`${BASE_URL}/csrf`);
};

export const register = async (data) => {
  await getCsrfToken();
  return axios.post(`${BASE_URL}/auth/register`, data);
};

export const login = async (data) => {
  await getCsrfToken();
  return axios.post(`${BASE_URL}/auth/token`, data);
};
