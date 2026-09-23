import axios from "axios";

/**
 * One shared Axios instance for the whole app.
 * - Every request automatically gets the login token attached (if we have one).
 * - Every response error is normalized into a plain { message, status } shape
 *   here, in one place, so components never have to parse Axios errors themselves.
 */
const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 15000,
});

// ---- Request interceptor: attach token ----
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ---- Response interceptor: central error handling ----
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Requests we cancelled on purpose (e.g. a newer search fired) are not
    // real errors - let the caller's catch block see them and ignore them.
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    let message = "Something went wrong. Please try again.";
    let status = null;

    if (error.response) {
      status = error.response.status;
      message = error.response.data?.message || message;

      // Session is invalid/expired - log the user out everywhere.
      if (status === 401 && typeof window !== "undefined") {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("authUser");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    } else if (error.request) {
      message = "Could not reach the server. Check your connection.";
    }

    // Attach the normalized info without losing the original error.
    error.normalizedMessage = message;
    error.status = status;
    return Promise.reject(error);
  }
);

export default api;
