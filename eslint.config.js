import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"]
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs"
    }
  },
  {
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      }
    },
    rules: {
      "no-unused-vars": "warn", // Variáveis não utilizadas gerarão aviso
      //"no-console": "error", // Proíbe console.log()
      "eqeqeq": ["error", "always"], // Exige uso de === e !==
      "semi": ["error", "always"], // Obriga o uso de ponto e vírgula
      "quotes": ["error", "double"], // Obriga aspas duplas
      "indent": ["error", 2], // Define indentação de 2 espaços
      "no-var": "error", // Proíbe uso de var, exige let/const
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];