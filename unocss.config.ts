import {
  defineConfig,
  presetWind3,
  presetAttributify,
  presetTagify,
  presetIcons,
} from "unocss";

export default defineConfig({
  shortcuts: { base: "text-base font-normal" },
  presets: [
    presetWind3(),
    presetAttributify({ prefix: "u-" }),
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
