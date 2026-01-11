// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightUtils from "@lorenzo_lewis/starlight-utils";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://gin-gonic.com",

  integrations: [
    starlight({
      plugins: [
        starlightUtils({
          multiSidebar: {
            switcherStyle: "horizontalList",
          },
        }),
      ],

      title: "Gin Web Framework",
      favicon: "/favicon.ico",
      logo: {
        src: "./src/assets/gin.png",
      },

      defaultLocale: "en",
      locales: {
        en: {
          label: "English",
          lang: "en",
        },
        es: {
          label: "Español",
          lang: "es",
        },
        fa: {
          label: "Persian",
          lang: "fa",
        },
        id: {
          label: "Bahasa Indonesia",
          lang: "id",
        },
        ja: {
          label: "日本語",
          lang: "ja",
        },
        "ko-kr": {
          label: "한국어",
          lang: "ko-kr",
        },
        pt: {
          label: "Português",
          lang: "pt",
        },
        ru: {
          label: "Russian",
          lang: "ru",
        },
        tr: {
          label: "Turkish",
          lang: "tr",
        },
        "zh-cn": {
          label: "简体中文",
          lang: "zh-cn",
        },
        "zh-tw": {
          label: "繁體中文",
          lang: "zh-tw",
        },
        ar: {
          label: "عربي",
          lang: "ar",
        },
      },

      social: {
        github: "https://github.com/gin-gonic/gin",
      },
      sidebar: [
        {
          label: "Docs",
          autogenerate: { directory: "docs" },
        },
        {
          label: "Blog",
          autogenerate: { directory: "blog" },
        },
      ],
      expressiveCode: {
        themes: ["github-dark", "github-light"],
      },
      editLink: {
        baseUrl: "https://github.com/gin-gonic/website/edit/master/",
      },
      customCss: ["./src/styles/custom.css"],
      lastUpdated: true,
      credits: false, // Opcional
      components: {
        SocialIcons: "./src/components/SocialIcons.astro",
      },
    }),
    sitemap(),
  ],
});
