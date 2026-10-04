// Static cuts of the website's fonts (Archivo, Instrument Serif, JetBrains Mono), subset to Latin
// and ₦. The display face is Archivo at width 62, weight 900, like the site's `.display` class.
export const fontFiles = {
  Display: require("../../assets/fonts/ArchivoExtraCondensed-Black.ttf"),
  Sans: require("../../assets/fonts/Archivo-Regular.ttf"),
  SansMedium: require("../../assets/fonts/Archivo-Medium.ttf"),
  SansSemiBold: require("../../assets/fonts/Archivo-SemiBold.ttf"),
  Serif: require("../../assets/fonts/InstrumentSerif-Italic.ttf"),
  Mono: require("../../assets/fonts/JetBrainsMono-Regular.ttf"),
  MonoMedium: require("../../assets/fonts/JetBrainsMono-Medium.ttf"),
};

export type FontName = keyof typeof fontFiles;
