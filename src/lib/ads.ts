import nookies from "nookies";

const BANNER_CODES = ["1944246", "1944247", "1944543", "1944544", "1944545"];
const POPUNDER_COOKIE = "kaguya_popunder";
const USER_COOKIE = "sb-access-token";

export const initBanners = () => {
  const cookies = nookies.get(null, "");

  const initBanner = (code: string, isShown: boolean) => {
    const scriptId = `__clb-${code}`;

    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");

    script.id = scriptId;
    script.src = `https://ssqyuvavse.com/lv/esnk/${code}/code.js`;
    script.type = "text/javascript";
    script.setAttribute("data-cfasync", "false");
    script.async = true;

    const container = document.querySelector(".catfish");
    const hiddenContainer = document.querySelector(".hidden-banner");

    if (isShown) {
      container.appendChild(script);
    } else {
      hiddenContainer.appendChild(script);
    }
  };

  if (cookies[USER_COOKIE]) {
    return;
  }

  BANNER_CODES.forEach((code) => initBanner(code, false));
};

export const initPopunder = () => {
  window.addEventListener("click", () => {
    const cookies = nookies.get(null, "");

    if (cookies[POPUNDER_COOKIE] || cookies[USER_COOKIE]) {
      return;
    }

    const pop = window.open(
      "https://bg4nxu2u5t.com/ERT/ERT.php?c=1944171",
      "kaguya_popunder"
    );

    pop.blur();

    window.focus();

    nookies.set(null, POPUNDER_COOKIE, "1", {
      // 7 days
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
  });
};
