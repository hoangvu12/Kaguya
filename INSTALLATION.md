# Self hosting

Here is the instructions to deploy Kaguya on your local machine.

There are 3 things that needed to run the website.

1. The website ([Kaguya](https://github.com/hoangvu12/Kaguya))
2. The server for scraping, pushing notifications and handling requests from the website. ([kaguya-scraper](https://github.com/hoangvu12/kaguya-scraper))
3. Database ([kaguya-database](https://github.com/hoangvu12/kaguya-database))

## Steps

1. ### Database

   First you have to get supabase's keys and url. [See detailed instructions](https://github.com/hoangvu12/kaguya-database)

2. ### Scraper

   Next, clone ([kaguya-scraper](https://github.com/hoangvu12/kaguya-scraper)) to your local machine.

   Run these to install all the independencies:

   ```bash
   cd kaguya-scraper
   yarn
   ```

   After that, rename `.env-example` to `.env` and fill all the variables

   ```
   # See https://github.com/hoangvu12/kaguya-database (Required)

   SUPABASE_KEY=
   SUPABASE_URL=

   # Push notification (npm run webPush:generate) (Optional)

   WEB_PUSH_PUBLIC_KEY=
   WEB_PUSH_PRIVATE_KEY=
   WEB_PUSH_EMAIL=

   # This will be your base route (https://example.com/BASE_ROUTE) (Optional but recommended)

   BASE_ROUTE=

   # Discord

   # Discord new anime/manga update channel id (Required)

   DISCORD_UPDATE_CHANNEL_ID=
   DISCORD_GUILD_ID=
   DISCORD_CLIENT_ID=
   DISCORD_TOKEN=

   # Discord storage (Optional, for file hostings purpose)

   DISCORD_WEBHOOK_URL=

   # Streamtape (Optional, for video hostings)

   STREAMTAPE_LOGIN=
   STREAMTAPE_API_KEY=
   ```

   Then, run these to start the server

   ```bash
   yarn build
   yarn start
   ```

   If it show to the console `Listening on port 3001`, then you just successfully deployed the server, now is running on `http://localhost:3001`.

3. ### Socket server (Optional)

   Next, clone ([kaguya-socket](https://github.com/hoangvu12/kaguya-socket)) to your local machine.

   Run these to install all the independencies:

   ```bash
   cd kaguya-socket
   yarn
   ```

   After that, rename `.env-example` to `.env` and fill all the variables

   ```
   # See https://github.com/hoangvu12/kaguya-database (Supabase private key)

   SUPABASE_KEY=
   SUPABASE_URL=

   # Redis (You can get one for free on https://upstash.com)

   REDIS_URL=

   # This will be your base route (https://example.com/BASE_ROUTE)

   BASE_ROUTE=
   ```

   Then, run these to start the server

   ```bash
   yarn start
   ```

   If it show to the console `Listening on port 3002`, then you just successfully deployed the server, now is running on `http://localhost:3002`.

4. ### Proxy server (Optional)

   Next, clone ([requests-proxy](https://github.com/hoangvu12/requests-proxy)) to your local machine.

   Run these to install all the independencies:

   ```bash
   cd requests-proxy
   yarn
   ```

   Then, run these to start the server

   ```bash
   yarn start
   ```

   If it show to the console `Listening on port 3002`, then you just successfully deployed the server, now is running on `http://localhost:3002`.

5. ### The website

   Next, clone ([Kaguya](https://github.com/hoangvu12/Kaguya)) to your local machine.

   Run these to install all the independencies:

   ```bash
   cd Kaguya
   yarn
   ```

   After that, rename `.env-example` to `.env` and fill all the variables

   ```
   # Supabase (See: https://github.com/hoangvu12/kaguya-database) (Required)
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=

   # Google Analytics (Optional but recommended)
   NEXT_PUBLIC_GA_ID=

   # See: https://github.com/hoangvu12/kaguya-scraper (Required)
   NEXT_PUBLIC_NODE_SERVER_URL=

   # See: https://github.com/hoangvu12/kaguya-socket (Optional)
   NEXT_PUBLIC_SOCKET_SERVER_URL=

   # See: https://github.com/hoangvu12/requests-proxy (Optional)
   NEXT_PUBLIC_PROXY_SERVER_URL=

   # Public web push key (https://github.com/hoangvu12/kaguya-scraper) (Optional)
   NEXT_PUBLIC_WEB_PUSH=

   # Sentry (Optional)
   SENTRY_AUTH_TOKEN=
   SENTRY_DSN=
   ```

   `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Get these on step 1.

   `NEXT_PUBLIC_NODE_SERVER_URL`: The URL of the scraping server, if you running on local machine then it should be `http://localhost:3001`

   `NEXT_PUBLIC_SOCKET_SERVER_URL`: The URL of the socket server, if you running on local machine then it should be `http://localhost:3002` (Optional)

   `NEXT_PUBLIC_PROXY_SERVER_URL`: The URL of the proxy server, if you running on local machine then it should be `http://localhost:3002` (Optional, you should change the port to avoid port already use)

   `NEXT_PUBLIC_WEB_PUSH`: The public web push key, you can get this one on scraping server by running `yarn webPush:generate` (Optional)

   `SENTRY_AUTH_TOKEN` and `SENTRY_DSN`: Get these from Sentry (Optional)

   Then start the website by running:

   ```bash
   yarn dev
   ```

   The website should start on `http://localhost:3000`.

   If you've done everything correctly, the website should working fine without any errors, but there won't be any media units (episodes and chapters).

## Notes

To add media units, you should create your own scraper on scraping server. (I've made some scrapers and public it. [See them here](https://github.com/hoangvu12/kaguya-scraper/tree/main/src/scrapers))

Then, run `yarn cli scraper:init` on your scraping server to start scraping. (Only needed to run once, it will takes a lot of time to scrape)

Still stuck? Feel free to ask me here:

[![Kaguya Discord server](https://discordapp.com/api/guilds/906042713688928257/widget.png?style=banner2)](https://discord.gg/382BEFfER6)
