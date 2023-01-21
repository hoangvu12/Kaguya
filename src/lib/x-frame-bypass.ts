import axios from "axios";

customElements.define(
  "x-frame-bypass",
  class extends HTMLIFrameElement {
    constructor() {
      super();
    }

    connectedCallback() {
      const useProxy = this.getAttribute("proxy");

      if (useProxy) {
        this.load(this.src, this.getAttribute("target"));
        this.src = "";
      }

      this.className = this.getAttribute("classname");
    }

    load(proxiedUrl: string, target: string) {
      if (!proxiedUrl || !proxiedUrl.startsWith("http"))
        throw new Error(
          `X-Frame-Bypass src ${proxiedUrl} does not start with http(s)://`
        );

      axios
        .get<string>(proxiedUrl)
        .then(({ data }) => {
          if (data)
            this.srcdoc = data.replace(
              /<head([^>]*)>/i,
              `<head$1>
              <base href="${target}">
              `
            );
        })
        .catch((e) => console.error("Cannot load X-Frame-Bypass:", e));
    }
  },
  { extends: "iframe" }
);

export {};
