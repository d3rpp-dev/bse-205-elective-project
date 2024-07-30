/** @type {import("prettier").Config} */
export default {
  /**
    Global Config
  */
  plugins: [
    "prettier-plugin-svelte",

    // must come last
    "prettier-plugin-tailwindcss",
  ],
  overrides: [
    {
      files: "*.svelte",
      options: {
        parser: "svelte",
      },
    },
  ],

  /**
    Default Config
  */
  htmlWhitespaceSensitivity: "ignore",
  bracketSameLine: false,

  /**
    Svelte Config
  */
  // nothing here yet
};
