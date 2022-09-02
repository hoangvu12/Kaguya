import config from "@/config";
import dayjs from "@/lib/dayjs";
import { Proxy } from "@/types";
import {
  Character,
  Media,
  MediaSeason,
  MediaType,
  Staff,
  Studio,
} from "@/types/anilist";
import axios from "axios";
import mime from "mime";
import { stringify } from "querystring";
import { toast } from "react-toastify";

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

export function parseTime(seconds: string | number) {
  seconds = seconds.toString();
  let minutes = Math.floor(Number(seconds) / 60).toString();
  let hours = "";

  if (Number(minutes) > 59) {
    hours = Math.floor(Number(minutes) / 60).toString();
    hours = Number(hours) >= 10 ? hours : `0${hours}`;
    minutes = (Number(minutes) - Number(hours) * 60).toString();
    minutes = Number(minutes) >= 10 ? minutes : `0${minutes}`;
  }

  seconds = Math.floor(Number(seconds) % 60).toString();
  seconds = Number(seconds) >= 10 ? seconds : "0" + seconds;

  if (hours) {
    return `${hours}:${minutes}:${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

export function serialize(obj: any) {
  return Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join("&");
}

export const chunk = <T>(arr: T[], chunkSize: number): T[][] => {
  const array: T[][] = [];

  for (let i = 0; i < arr.length; i += chunkSize)
    array.push(arr.slice(i, i + chunkSize));

  return array;
};

export const includesArr = (text: string, array: any[]) => {
  return array.some((element) => text.includes(element));
};

export const getPagination = (page?: number, limit: number = 15) => {
  const from = page - 1 > 0 ? limit * (page - 1) + 1 : 0;
  const to = page - 1 > 0 ? from + limit : limit;

  return {
    from,
    to: to - 1,
  };
};

export const getSeason = () => {
  const month = dayjs().month();
  const year = dayjs().year();

  let season = MediaSeason.Winter;

  if (3 <= month && month <= 5) {
    season = MediaSeason.Spring;
  }

  if (6 <= month && month <= 8) {
    season = MediaSeason.Summer;
  }

  if (9 <= month && month <= 11) {
    season = MediaSeason.Fall;
  }

  return {
    season,
    year,
  };
};

// https://stackoverflow.com/questions/5457416/how-to-validate-numeric-values-which-may-contain-dots-or-commas
export const parseNumbersFromString = (
  text: string,
  fallbackNumber = null
): number[] => {
  const matches = text.match(/\d+([\.,][\d{1,2}])?/g);

  if (!matches) return [fallbackNumber];

  return matches.map(Number);
};

export const parseNumberFromString = (text: string, fallbackNumber = null) => {
  return parseNumbersFromString(text, fallbackNumber)[0];
};

export const parseBetween = (str, start, end) => {
  const startIndex = str.indexOf(start) + start.length;
  const endIndex = str.indexOf(end);

  return str.substring(startIndex, endIndex);
};

// https://stackoverflow.com/questions/28360978/css-how-to-get-browser-scrollbar-width-for-hover-overflow-auto-nice-margi
export const getScrollbarSize = () =>
  window.innerWidth - document.documentElement.offsetWidth;

export const isFalsy = (value: any) => {
  return value === undefined || value === null || value === "";
};

export const base64ToUint8Array = (base64: string) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

// https://stackoverflow.com/questions/1064089/inserting-a-text-where-cursor-is-using-javascript-jquery
export const insertTextAtCursor = (input: HTMLInputElement, text: string) => {
  const { selectionStart, selectionEnd, value } = input;

  const beforeStr = value.substring(0, selectionStart);
  const afterStr = value.substring(selectionEnd, value.length);
  const newSelection = selectionStart + text.length;

  input.value = `${beforeStr}${text}${afterStr}`;
  input.selectionStart = newSelection;
  input.selectionEnd = newSelection;
};

export const arePropertiesFalsy = (obj: any) =>
  Object.keys(obj).every((key) => isFalsy(obj[key]));

export const formatDate = (date: {
  day?: number;
  month?: number;
  year?: number;
}) => {
  let day = dayjs();
  let format = [];

  if (!isFalsy(date.day)) {
    day = day.date(date.day);
    format.push("DD");
  }

  if (!isFalsy(date.month)) {
    day = day.month(date.month - 1);
    format.push("MM");
  }

  if (!isFalsy(date.year)) {
    day = day.year(date.year);
    format.push("YYYY");
  }

  return day.format(format.join("/"));
};

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
export function isValidUrl(string: string) {
  let url: URL;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export const groupBy = <T, K extends string>(
  list: T[],
  getKey: (data: T) => K
) =>
  list.reduce((previous, currentItem) => {
    const key = getKey(currentItem);

    if (!previous[key]) previous[key] = [];

    previous[key].push(currentItem);

    return previous;
  }, {} as Record<string, T[]>);

// https://gist.github.com/bluzky/b8c205c98ff3318907b30c3e0da4bf3f
export const vietnameseSlug = (str: string) => {
  const from =
    "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ";
  const to =
    "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";

  let newStr = str;

  for (let i = 0, l = from.length; i < l; i++) {
    newStr = newStr.replace(RegExp(from[i], "gi"), to[i]);
  }

  newStr = newStr
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\-]/g, "-")
    .replace(/-+/g, "-");

  return newStr;
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const debounce = (func: Function, wait: number) => {
  let timeout: any;

  return (...args: any[]) => {
    const later = () => {
      timeout = null;
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export function convertTime(seconds: string | number) {
  seconds = seconds.toString();
  let minutes = Math.floor(Number(seconds) / 60).toString();
  let hours = "";

  if (Number(minutes) > 59) {
    hours = Math.floor(Number(minutes) / 60).toString();
    hours = Number(hours) >= 10 ? hours : `0${hours}`;
    minutes = (Number(minutes) - Number(hours) * 60).toString();
    minutes = Number(minutes) >= 10 ? minutes : `0${minutes}`;
  }

  seconds = Math.floor(Number(seconds) % 60).toString();
  seconds = Number(seconds) >= 10 ? seconds : "0" + seconds;

  if (hours) {
    return `${hours}:${minutes}:${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

export const getFileNameFromUrl = (url: string) => {
  return new URL(url).pathname.split("/").pop();
};

export const download = async (url: string, name: string) => {
  if (!url) {
    throw new Error("Resource URL not provided! You need to provide one");
  }

  fetch(url, { mode: "no-cors" })
    .then((response) => response.blob())
    .then((blob) => {
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobURL;
      a.style.display = "none";

      if (name && name.length) a.download = name;
      document.body.appendChild(a);
      a.click();

      toast.info("The file has been downloaded successfully!");
    });
};

export const removeArrayOfObjectDup = <T extends object, K extends keyof T>(
  arr: T[],
  property: K
) => {
  return arr.filter(
    (obj, index, self) =>
      index === self.findIndex((t) => t[property] === obj[property])
  );
};

export const fulfilledPromises = <T extends Promise<any>>(promises: T[]) =>
  Promise.allSettled(promises).then((results) =>
    results
      .filter((result) => result.status === "fulfilled")
      .map((result) => (result as PromiseFulfilledResult<Awaited<T>>).value)
  );

// This is for avoiding anilist's rate limit on build time
export const prodSleep = (ms: number) => {
  if (process.env.NODE_ENV === "production") {
    return sleep(ms);
  }

  return Promise.resolve();
};

// https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
export const humanFileSize = (size: number) => {
  if (size === 0) return "0 KB";

  const i = Math.floor(Math.log(size) / Math.log(1024));

  // @ts-ignore
  const convertedNumber = (size / Math.pow(1024, i)).toFixed(2) * 1;
  const units = ["B", "KB", "MB", "GB", "TB"];
  const unit = units[i];

  return `${convertedNumber} ${unit}`;
};

// https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
export const randomString = (length: number) => {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz".split("");

  if (!length) {
    length = Math.floor(Math.random() * chars.length);
  }

  let str = "";

  for (var i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
};

export const createFileFromUrl = async (url: string, filename: string) => {
  const { data } = await axios.get<Blob>(url, { responseType: "blob" });

  const extension = url.split(".").pop();

  const metadata = {
    type: mime.getType(extension) || "text/plain",
  };

  const file = new File([data], filename, metadata);

  return file;
};

export const createProxyUrl = (
  url: string,
  proxy: Proxy,
  isPublicProxy?: boolean
) => {
  if (isPublicProxy) return `https://corsproxy.io/?${encodeURIComponent(url)}`;

  const composeHeaders = (
    headers: Record<string, string>
  ): [string, string][] => {
    return Object.entries(headers).map(([key, value]) => [key, value]);
  };

  const { appendReqHeaders = {}, appendResHeaders = {}, ...rest } = proxy;

  const modifiedAppendReqHeaders = JSON.stringify(
    composeHeaders(appendReqHeaders)
  );
  const modifiedAppendResHeaders = JSON.stringify(
    composeHeaders(appendResHeaders)
  );

  const params = stringify({
    appendReqHeaders: modifiedAppendReqHeaders,
    appendResHeaders: modifiedAppendResHeaders,
    ...rest,
  });

  return `${config.proxyServerUrl}/?url=${encodeURIComponent(url)}&${params}`;
};

export const createAttachmentUrl = (url: string) => {
  return `${config.nodeServerUrl}/file/${url}`;
};

export const createMediaDetailsUrl = (media: Media) => {
  if (media.type === MediaType.Anime) {
    return `/anime/details/${media.id}/${vietnameseSlug(
      media.title.userPreferred
    )}`;
  }

  return `/manga/details/${media.id}/${vietnameseSlug(
    media.title.userPreferred
  )}`;
};

export const createCharacterDetailsUrl = (character: Character) => {
  return `/characters/details/${character.id}/${vietnameseSlug(
    character?.name?.userPreferred
  )}`;
};

export const createVoiceActorDetailsUrl = (voiceActor: Staff) => {
  return `/voice-actors/details/${voiceActor.id}/${vietnameseSlug(
    voiceActor?.name?.userPreferred
  )}`;
};

export const createStudioDetailsUrl = (studio: Studio) => {
  return `/studios/${studio.id}/${vietnameseSlug(studio?.name)}`;
};

export const sortObjectByValue = <T extends object>(
  obj: T,
  sortFn: (a: T[keyof T], b: T[keyof T]) => number
) => {
  const sortedObj = Object.keys(obj)
    .sort((a, b) => sortFn(obj[a], obj[b]))
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {} as T);

  return sortedObj;
};

// https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
export const array_move = <T>(
  arr: T[],
  old_index: number,
  new_index: number
) => {
  const clonedArr = [...arr];

  if (new_index >= arr.length) {
    let k = new_index - clonedArr.length + 1;
    while (k--) {
      clonedArr.push(undefined);
    }
  }

  clonedArr.splice(new_index, 0, clonedArr.splice(old_index, 1)[0]);
  return clonedArr;
};

/**
 * By Ken Fyrstenberg Nilsen
 *
 * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
 *
 * If image and context are only arguments rectangle will equal canvas
 */
export function drawImageProp(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x?: number,
  y?: number,
  w?: number,
  h?: number,
  offsetX?: number,
  offsetY?: number
) {
  if (arguments.length === 2) {
    x = y = 0;
    w = ctx.canvas.width;
    h = ctx.canvas.height;
  }

  // default offset is center
  offsetX = typeof offsetX === "number" ? offsetX : 0.5;
  offsetY = typeof offsetY === "number" ? offsetY : 0.5;

  // keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0;
  if (offsetY < 0) offsetY = 0;
  if (offsetX > 1) offsetX = 1;
  if (offsetY > 1) offsetY = 1;

  let iw = img.width,
    ih = img.height,
    r = Math.min(w / iw, h / ih),
    nw = iw * r, // new prop. width
    nh = ih * r, // new prop. height
    cx = 0,
    cy = 0,
    cw = 0,
    ch = 0,
    ar = 1;

  // decide which gap to fill
  if (nw < w) ar = w / nw;
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; // updated
  nw *= ar;
  nh *= ar;

  // calc source rectangle
  cw = iw / (nw / w);
  ch = ih / (nh / h);

  cx = (iw - cw) * offsetX;
  cy = (ih - ch) * offsetY;

  // make sure source rectangle is valid
  if (cx < 0) cx = 0;
  if (cy < 0) cy = 0;
  if (cw > iw) cw = iw;
  if (ch > ih) ch = ih;

  // fill image in dest. rectangle
  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}
