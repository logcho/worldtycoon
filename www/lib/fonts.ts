import localFont from "next/font/local";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

/* -----------------------------------------------------------------------------------------------
 * Geist Fonts (https://vercel.com/font / https://www.npmjs.com/package/geist)
 * -----------------------------------------------------------------------------------------------*/

export const fontSans = GeistSans;

export const fontMono = GeistMono;

/* -----------------------------------------------------------------------------------------------
 * Google Fonts
 * -----------------------------------------------------------------------------------------------*/

// ...

/* -----------------------------------------------------------------------------------------------
 * Local Fonts
 * -----------------------------------------------------------------------------------------------*/

// ...

export const fixedsys = localFont({
  src: "../public/fonts/Fixedsys.ttf",
  variable: "--font-fixedsys",
});

export const bitMap = localFont({
  src: "../public/fonts/Bitmap.ttf",
  variable: "--font-bitmap",
});
