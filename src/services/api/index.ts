import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";

const envData: ImportMetaEnv = import.meta.env;

const Api: AxiosInstance = axios.create({
  baseURL: `${envData.VITE_BACKEND_URL}/${envData.VITE_BACKEND_API_PREFIX}/${envData.VITE_BACKEND_API_VERSION}`,
});

Api.interceptors.request.use((config) => {
  if (!config.headers) {
    return config;
  }

  const token = localStorage.getItem("accessToken") || "";
  if (token) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders,
    };
  }

  return config;
});

Api.interceptors.response.use(
  (res: any) => {
    return res;
  },
  function (err) {
    const status = err?.response?.status;
    const message = err?.response?.data?.message;
    if (status === 401 || status === 403) {
      localStorage.removeItem("accessToken");
      window.location.href = "/sign-in";
    }
    return Promise.reject(new Error(message));
  }
);

export default Api;
