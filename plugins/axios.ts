import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const instance = axios.create({
    baseURL: config.public.apiBaseUrl,
  });

  instance.interceptors.request.use((request) => {
    if (process.client) {
      const token = localStorage.getItem("token");
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }
    }
    return request;
  });

  nuxtApp.provide("axios", instance);
});
