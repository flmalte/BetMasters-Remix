
# Welcome to Remix + Vite!
📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/guides/vite) for details on supported features.

## Setup

Before starting the development server, ensure you have the necessary dependencies installed and your environment variables configured.

1. Install the dependencies:
   ```sh
   npm install
   ```

2. Rename the environment file:
   ```sh
   mv .env.example .env
   ```

## Development

Run the Vite dev server:

```sh
npm run dev
```

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.
Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`
