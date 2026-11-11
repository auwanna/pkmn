import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/rspack";
import { pluginTailwindcss } from "@rsbuild/plugin-tailwindcss";

export default defineConfig({
  html: {
    title: "Pokédex",
    favicon: "./src/assets/images/icon.png",
  },
  plugins: [
    pluginReact({
      reactCompiler: true,
    }),
    pluginTailwindcss(),
  ],
  tools: {
    rspack: {
      plugins: [
        tanstackRouter({
          target: "react",
          autoCodeSplitter: true,
        }),
      ],
    },
  },
});
