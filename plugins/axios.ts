import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const instance = axios.create({
    baseURL: "https://98da63106715be00063abd3281040a13.serveo.net/api",
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
