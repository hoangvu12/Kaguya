import {
  CHARACTERS_ROLES,
  FORMATS,
  GENRES,
  SEASONS,
  STATUSES,
  VIETNAMESE_CHARACTERS_ROLES,
  VIETNAMESE_FORMATS,
  VIETNAMESE_SEASONS,
  VIETNAMESE_STATUSES,
} from "@/constants";

export const randomElement = <T>(array: T[]): T => {
  const index = Math.floor(Math.random() * array.length);

  return array[index];
};

export const randomElements = <T>(array: T[], length: number): T[] => {
  const randomArr: T[] = [];

  for (let i = 0; i < length; i++) {
    randomArr.push(randomElement(array));
  }

  return randomArr;
};

//https://stackoverflow.com/questions/9733288/how-to-programmatically-calculate-the-contrast-ratio-between-two-colors
export function luminance(r: number, g: number, b: number) {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
export function contrast(rgb1: number[], rgb2: number[]) {
  var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  var brightest = Math.max(lum1, lum2);
  var darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

export const isColorVisible = (
  textColor: string,
  backgroundColor: string = "#000000",
  ratio: number = 3.2
) => {
  const textColorRgb = hexToRgb(textColor);
  const backgroundColorRgb = hexToRgb(backgroundColor);

  return contrast(textColorRgb, backgroundColorRgb) >= ratio;
};

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
