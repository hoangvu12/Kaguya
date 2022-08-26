# Self hosting

There are 3 things that needed to run the website.

1. The website ([Kaguya](https://github.com/hoangvu12/Kaguya))
2. The server for scraping, pushing notifications and handling requests from the website. ([kaguya-scraper](https://github.com/hoangvu12/kaguya-scraper))
3. The server for handling sockets. ([kaguya-socket](https://github.com/hoangvu12/kaguya-socket))
4. Database ([kaguya-database](https://github.com/hoangvu12/kaguya-scraper))

## The website

1. ### Clone the website

   ```bash
   git clone https://github.com/hoangvu12/Kaguya
   ```

2. ### Rename `.env-example` to `.env` and fill in the values

   1. #### Database

      - `NEXT_PUBLIC_SUPABASE_URL`: This is supabase's URL, you can get it from ([kaguya-database](https://github.com/hoangvu12/kaguya-scraper))
      - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Same as URL.

   2. #### Servers

      - `NEXT_PUBLIC_NODE_SERVER_URL`: URL of the scraping server ([kaguya-scraper](https://github.com/hoangvu12/kaguya-scraper))

      - `NEXT_PUBLIC_SOCKET_SERVER_URL`: URL of the handling sockets server ([kaguya-socket](https://github.com/hoangvu12/kaguya-socket))

      - `NEXT_PUBLIC_PROXY_SERVER_URL`: URL of the proxy server (to modify requests, mainly to bypass cors or adding headers) ([requests-proxy](https://github.com/hoangvu12/requests-proxy)) [Optional]

   3. #### Google Analytics

      - `NEXT_PUBLIC_GA_ID`: Google analytics's ID [Optional]

   4. #### Public web push key

      - `NEXT_PUBLIC_WEB_PUSH`: Web push public key for notifications pushing, you can get it by running `npm run webPush:generate` on scraping server ([kaguya-scraper](https://github.com/hoangvu12/kaguya-scraper)) [Optional]

   5. #### Sentry
      - `SENTRY_AUTH_TOKEN`: Sentry auth token for error tracking [Optional]

3. ### Run `npm run dev` to start the server

4. ### For hosting, you could use some hosting services like [Vercel](https://vercel.app) or [Netlify](https://www.netlify.com) to host the website, or since the website using NextJS framework, you could just self-host it by your own. [Read more](https://nextjs.org/docs/deployment)
