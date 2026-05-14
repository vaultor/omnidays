import builtins from "builtin-modules"
import { copyFileSync, readdirSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { defineConfig } from "vite-plus"

const prod = process.env.NODE_ENV === "production"
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const copyDistToRoot = {
  name: "copy-dist-to-root",
  closeBundle() {
    try {
      const distDir = path.resolve(__dirname, "dist")
      for (const file of readdirSync(distDir)) {
        copyFileSync(path.join(distDir, file), path.resolve(__dirname, file))
      }
    } catch (e) {
      console.error("copy-dist-to-root failed:", e)
    }
  },
}

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: ["dist/**", "node_modules/**"],
    semi: false,
    sortImports: {
      newlinesBetween: false,
      groups: [
        ["value-builtin", "value-external"],
        "type-internal",
        "value-internal",
        ["type-parent", "type-sibling", "type-index"],
        ["value-parent", "value-sibling", "value-index"],
        "type-import",
        "unknown",
      ],
    },
  },
  lint: {
    ignorePatterns: ["dist/**", "node_modules/**"],
    options: { typeAware: true, typeCheck: true },
    jsPlugins: ["eslint-plugin-obsidianmd"],
    // rules: {
    //   "no-new": "off",
    //   "import/no-default-export": "off",
    //   "jsdoc/require-param": "off",
    //   "jsdoc/require-returns": "off",
    //   "typescript/no-non-null-assertion": "warn",
    //   "promise/prefer-await-to-then": "warn",
    //   "promise/prefer-await-to-callbacks": "warn",
    //   "obsidianmd/commands/no-command-in-command-id": "error",
    //   "obsidianmd/commands/no-command-in-command-name": "error",
    //   "obsidianmd/commands/no-default-hotkeys": "error",
    //   "obsidianmd/commands/no-plugin-id-in-command-id": "error",
    //   "obsidianmd/commands/no-plugin-name-in-command-name": "error",
    //   "obsidianmd/settings-tab/no-manual-html-headings": "error",
    //   "obsidianmd/settings-tab/no-problematic-settings-headings": "error",
    //   "obsidianmd/vault/iterate": "error",
    //   "obsidianmd/detach-leaves": "error",
    //   "obsidianmd/editor-drop-paste": "error",
    //   "obsidianmd/hardcoded-config-path": "error",
    //   "obsidianmd/no-forbidden-elements": "error",
    //   "obsidianmd/no-global-this": "error",
    //   "obsidianmd/no-sample-code": "error",
    //   "obsidianmd/no-tfile-tfolder-cast": "error",
    //   "obsidianmd/no-static-styles-assignment": "error",
    //   "obsidianmd/object-assign": "error",
    //   "obsidianmd/platform": "error",
    //   "obsidianmd/prefer-get-language": "error",
    //   "obsidianmd/prefer-abstract-input-suggest": "error",
    //   "obsidianmd/prefer-window-timers": "error",
    //   "obsidianmd/prefer-active-doc": "warn",
    //   "obsidianmd/regex-lookbehind": "error",
    //   "obsidianmd/sample-names": "error",
    //   "obsidianmd/validate-manifest": "error",
    //   "obsidianmd/validate-license": ["error"],
    //   "obsidianmd/ui/sentence-case": ["error", { enforceCamelCaseLower: true }],
    // },
  },
  plugins: [copyDistToRoot],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "main",
      fileName: () => "main.js",
      formats: ["cjs"],
    },
    minify: prod,
    sourcemap: prod ? false : "inline",
    cssCodeSplit: false,
    emptyOutDir: false,
    outDir: "dist/",
    rolldownOptions: {
      output: {
        entryFileNames: "main.js",
        assetFileNames: "styles.css",
      },
      external: [
        "obsidian",
        "electron",
        "@codemirror/autocomplete",
        "@codemirror/collab",
        "@codemirror/commands",
        "@codemirror/language",
        "@codemirror/lint",
        "@codemirror/search",
        "@codemirror/state",
        "@codemirror/view",
        "@lezer/common",
        "@lezer/highlight",
        "@lezer/lr",
        ...builtins,
      ],
    },
  },
})
