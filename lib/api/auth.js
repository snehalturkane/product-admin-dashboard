import api from "@/lib/axiosClient";

// POST /auth/login - DummyJSON returns { id, username, ..., accessToken }
export function loginRequest(username, password) {
  return api.post("/auth/login", {
    username,
    password,
    expiresInMins: 60,
  });
}
