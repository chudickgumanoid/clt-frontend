import axios from "axios";
import { BASE_API_URL } from "@/shared/utils/constants";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const instance = axios.create({
    baseURL: BASE_API_URL,
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
