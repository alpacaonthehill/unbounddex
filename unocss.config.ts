import {
  defineConfig,
  presetWind3,
  presetAttributify,
  presetTagify,
  presetIcons,
} from "unocss";

export default defineConfig({
  rules: [["break-word", { "word-break": "break-word" }]],
  shortcuts: {
    wrap: "shrink whitespace-normal",
    "wrap-break": "shrink whitespace-normal break-word",
  },
  presets: [
    presetWind3(),
    presetAttributify(),
    presetTagify(),
    presetIcons({
      prefix: "icon",
      scale: 1.5,
      extraProperties: {
        display: "inline-block",
      },
      collections: {
        "": () => import("@iconify-json/heroicons/icons.json").then((i) => i.default),
        "-custom": {},
      },
    }),
  ],
});
