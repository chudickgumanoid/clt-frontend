import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",

  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/image",
    "@nuxtjs/google-fonts",
    "@vueuse/nuxt",
    "@nuxtjs/i18n",
  ],
  css: ["~/assets/css/main.css"],

  vite: { plugins: [tailwindcss()] },

  i18n: {
    defaultLocale: 'ru',
    locales: [
      { code: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'kz', name: 'Казахский', file: 'kz.json' }
    ]
  },

  googleFonts: {
    families: {
      Roboto: [400, 500, 700],
    },
    display: "swap",
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_URL,
    },
  },
});
