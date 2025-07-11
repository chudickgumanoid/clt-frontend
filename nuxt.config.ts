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
    defaultLocale: "ru",
    locales: [
      { code: "ru", name: "Русский", file: "ru.json" },
      { code: "kz", name: "Казахский", file: "kz.json" },
    ],
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

  app: {
    head: {
      title: "CLT - Рай китайских запчастей",
      htmlAttrs: {
        lang: "ru",
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Интернет-магазин китайских автозапчастей CLT — большой выбор, доступные цены, доставка по всему Казахстану",
        },
        {
          name: "keywords",
          content:
            "CLT, автозапчасти, китайские запчасти, автозапчасти Алматы, Chery, Geely, Haval, JAC, автозапчасти Казахстан",
        },

        { property: "og:title", content: "CLT - Рай китайских запчастей" },
        {
          property: "og:description",
          content:
            "Большой выбор китайских автозапчастей с доставкой по Казахстану.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://cltauto.kz" },
        { property: "og:image", content: "https://clt.kz/image/og-image.jpg" },

        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "CLT - Рай китайских запчастей" },
        {
          name: "twitter:description",
          content: "Китайские автозапчасти от CLT с доставкой по Казахстану",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
});
