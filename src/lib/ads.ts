const BANNER_CODES = ["1944246", "1944247"];

export const initBanners = () => {
  const initBanner = (code: string) => {
    const scriptId = `__clb-${code}`;

    const existingScript = document.getElementById(scriptId);

    console.log("init banner", code);

    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");

    script.id = scriptId;
    script.src = `https://ssqyuvavse.com/lv/esnk/${code}/code.js`;
    script.type = "text/javascript";
    script.setAttribute("data-cfasync", "false");
    script.async = true;

    document.body.appendChild(script);
  };

  BANNER_CODES.forEach((code) => initBanner(code));
};
