import nookies from "nookies";

// const BANNER_CODES = ["1944246", "1944247", "1944543", "1944544", "1944545"];
const BANNER_CODES = ["1944246"];
const POPUNDER_COOKIE = "kaguya_popunder";

export const initBanners = () => {
  const initBanner = (code: string) => {
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

    const container = document.querySelector(".banner-ads");

    container.appendChild(script);
  };

  BANNER_CODES.forEach((code) => initBanner(code));
};

export const initPopunder = () => {
  window.addEventListener("click", () => {
    const cookies = nookies.get(null, "");

    if (cookies[POPUNDER_COOKIE]) {
      return;
    }

    const pop = window.open(
      "https://bg4nxu2u5t.com/ERT/ERT.php?c=1944171",
      "kaguya_popunder"
    );

    pop.blur();

    window.focus();

    nookies.set(null, POPUNDER_COOKIE, "1", {
      // 6 hours
      maxAge: 6 * 60 * 60,
      path: "/",
    });
  });
};
