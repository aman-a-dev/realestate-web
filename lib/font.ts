import { Poppins } from "next/font/google";
import localFont from "next/font/local";

export const melodramaFont = localFont({ src: "./melodrama-font.otf" });

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});
