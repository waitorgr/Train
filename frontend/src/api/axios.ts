import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      if (!refresh) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.reload();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          "http://localhost:8000/api/users/token/refresh/",
          { refresh }
        );

        localStorage.setItem("access", data.access);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${data.access}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.reload();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;