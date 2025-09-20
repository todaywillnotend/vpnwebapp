import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const BASE_URL = "/api/proxy";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-token");
        console.warn("Authentication failed");
      }
    }
    return Promise.reject(error);
  }
);

// Кастомная функция для orval
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();

  // Убираем /api/ из начала URL для корректной работы с прокси
  let url = config.url || "";
  if (url.startsWith("/api/")) {
    url = url.replace("/api/", "");
  }

  const fullConfig = {
    ...config,
    ...options,
    url,
    cancelToken: source.token,
  };

  const promise = apiClient(fullConfig).then(
    ({ data }: AxiosResponse<T>) => data
  );

  // @ts-ignore - добавляем метод cancel для совместимости с React Query
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export default apiClient;
