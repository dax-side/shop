// Static cuts of the website's fonts (Archivo, Instrument Serif, JetBrains Mono), subset to Latin
// and ₦. Keys avoid generic CSS family names ("serif", "mono") so the web build uses them too.
// The display face is Archivo at width 62, weight 900, like the site's `.display` class.
export const fontFiles = {
  ArchivoDisplay: require("../../assets/fonts/ArchivoExtraCondensed-Black.ttf"),
  Archivo: require("../../assets/fonts/Archivo-Regular.ttf"),
  ArchivoMedium: require("../../assets/fonts/Archivo-Medium.ttf"),
  ArchivoSemiBold: require("../../assets/fonts/Archivo-SemiBold.ttf"),
  InstrumentSerif: require("../../assets/fonts/InstrumentSerif-Regular.ttf"),
  InstrumentSerifItalic: require("../../assets/fonts/InstrumentSerif-Italic.ttf"),
  JetBrainsMono: require("../../assets/fonts/JetBrainsMono-Regular.ttf"),
  JetBrainsMonoMedium: require("../../assets/fonts/JetBrainsMono-Medium.ttf"),
};

export type FontName = keyof typeof fontFiles;
