import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const BASE_URL = "/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Интерцептор для автоматического добавления токена авторизации
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-token");
        // Можно добавить редирект на страницу входа
        console.warn("Authentication failed, token removed");
      }
    }
    return Promise.reject(error);
  }
);

// Кастомная функция для orval (обновленная для новых API routes)
export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const source = axios.CancelToken.source();

  // Маппинг старых путей на новые API routes
  let url = config.url || "";

  // Преобразуем старые пути в новые
  if (url.includes("/users/")) {
    // /users/{tg_id} -> /users/{tg_id}
    url = url.replace(/^\/users\//, "/users/");
  } else if (url.includes("/keys/all/")) {
    // /keys/all/{tg_id} -> /keys
    url = "/keys";
  } else if (url.includes("/referrals/all/")) {
    // /referrals/all/{tg_id} -> /referrals
    url = "/referrals";
  } else if (url.includes("/payments/by_tg_id/")) {
    // /payments/by_tg_id/{tg_id} -> /referrals (включены в referrals API)
    url = "/referrals";
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

// Новые API функции для прямого использования
export const api = {
  // Аутентификация
  auth: {
    telegram: (authData: any) => apiClient.post("/auth/telegram", authData),
    checkSession: () => apiClient.get("/auth/telegram"),
  },

  // Пользователи
  users: {
    getById: (tgId: number) => apiClient.get(`/users/${tgId}`),
    update: (tgId: number, data: any) =>
      apiClient.patch(`/users/${tgId}`, data),
  },

  // Ключи
  keys: {
    getAll: () => apiClient.get("/keys"),
    getById: (keyId: string) =>
      apiClient.get(`/keys/${encodeURIComponent(keyId)}`),
    create: (keyData: any) => apiClient.post("/keys", keyData),
    update: (keyId: string, keyData: any) =>
      apiClient.patch(`/keys/${encodeURIComponent(keyId)}`, keyData),
    delete: (keyId: string) =>
      apiClient.delete(`/keys/${encodeURIComponent(keyId)}`),
  },

  // Рефералы
  referrals: {
    getAll: () => apiClient.get("/referrals"),
  },
};

export default apiClient;
