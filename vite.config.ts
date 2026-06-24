import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  root: "src", // location for index.html
  build: {
    outDir: "../dist", // relative to "root" above
  },
  server: {
    port: 3000,
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Holy Bible Recovery Version 2026",
        short_name: "RcvBible2026",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        description:
          "The Recovery Version Bible Old and New Testament with outlines and footnotes, in English and Simplified Chinese.",
        categories: [
          "holy",
          "God",
          "Jesus",
          "Christianity",
          "bible",
          "books",
          "education",
          "testament",
          "faith",
          "scriptures",
          "scrolls",
        ],
        icons: [
          {
            src: "images/brown-book-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "images/brown-book-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
