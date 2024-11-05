import { defineConfig, configDefaults } from "vitest/config"

// import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: "jsdom",
    exclude: [
      "./src/**/*.types.ts",
      "./src/**/*.config.js",
      "./src/**/*.d.ts",
      ...configDefaults.exclude,
    ],
    coverage: {
      // Except utility files
      exclude: [
        "./src/**/*.types.ts",
        "./src/**/*.test.tsx",
        "./src/**/*.test.ts",
        "**/*.config.[j|t]s",
        "**/*.config.cjs",
        "./src/**/*.d.ts",
        "./src/App.tsx",
        "./src/main.tsx",
      ],
    },
  },
})
