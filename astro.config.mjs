// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightUtils from "@lorenzo_lewis/starlight-utils";

// https://astro.build/config
export default defineConfig({

	integrations: [
		starlight({
			plugins: [starlightUtils({
				multiSidebar: {
					switcherStyle: "horizontalList",
				},
			})],

			title: 'Gin Web Framework',
			favicon: '/favicon.ico',
			logo: {
				src: "./src/assets/gin.png",
			},
			
			defaultLocale: 'en',
			locales: {
				'en': {
					label: 'English',
					lang: 'en',
				},
				'es': {
					label: 'Español',
					lang: 'es',
				},
				"fa": {
					label: "fa",
					lang: "fa",
				},
				"ja": {
					label: "ja",
					lang: "ja",
				},
				"ko-kr": {
					label: "ko-kr",
					lang: "ko-kr",
				},
				"pt": {
					label: "pt",
					lang: "pt",
				},
				"ru": {
					label: "ru",
					lang: "ru",
				},
				"tr": {
					label: "tr",
					lang: "tr",
				},
				"zh-cn": {
					label: "zh-cn",
					lang: "zh-cn",
				},
				"zh-tw": {
					label: "zh-tw",
					lang: "zh-tw",
				},
			},

			social: {
				github: 'https://github.com/gin-gonic/gin',
			},
			sidebar: [
				{
					label: "Docs",
					autogenerate: { directory: "docs" }
				},
				{
					label: "Blog",
					autogenerate: { directory: "blog" }
				},
			],

			customCss: [
				'./src/styles/custom.css',
			],

			expressiveCode: {
				themes: ['github-dark', 'github-light'],
			},

			editLink: {
				baseUrl: 'https://github.com/gin-gonic/website/edit/master/',
			},

			lastUpdated: true,
			credits: false, // Opcional
		}),
	],
});
