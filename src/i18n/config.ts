export const locales = ["hr", "sr", "bs", "sl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "hr";

export const localeNames: Record<Locale, string> = {
  hr: "Hrvatski",
  sr: "Srpski",
  bs: "Bosanski",
  sl: "Slovenščina",
};

export const localeFlags: Record<Locale, string> = {
  hr: "\ud83c\udded\ud83c\uddf7",
  sr: "\ud83c\uddf7\ud83c\uddf8",
  bs: "\ud83c\udde7\ud83c\udde6",
  sl: "\ud83c\uddf8\ud83c\uddee",
};

export const countryToLocale: Record<string, Locale> = {
  HR: "hr",
  RS: "sr",
  BA: "bs",
  ME: "sr",
  SI: "sl",
};
