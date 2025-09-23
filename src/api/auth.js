const BASE_URL = "https://chatify-api.up.railway.app";


const getToken = () => sessionStorage.getItem("token");

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCsrfToken = async () => {
  try {
    const res = await fetch(`${BASE_URL}/csrf`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
    });
    const data = await res.json();
    const { csrfToken } = data;
    if (csrfToken) {
      localStorage.setItem("csrfToken", csrfToken);
    }
    return csrfToken;
  } catch (error) {
    console.error("Misslyckades att hämta CSRF-token", error);
    throw error;
  }
};

export const register = async (formData) => {
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
      ...authHeaders(),
    },
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error("Registrering misslyckades");
  return res.json();
};

export const login = async (formData) => {
  const csrfToken = await getCsrfToken();
  const res = await fetch(`${BASE_URL}/auth/token`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
      ...authHeaders(),
    },
    body: JSON.stringify(formData),
  });
  if (!res.ok) throw new Error("Inloggning misslyckades");
  return res.json();
};

export const fetchSecret = async () => {
  const res = await fetch(`${BASE_URL}/secret`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...authHeaders(),
    },
  });
  if (!res.ok) throw new Error("Misslyckades att hämta hemlig data");
  return res.json();
};