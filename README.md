# SourceCheck HonorBox UI

Frontend App (Web UI) for SourceCheck's [HonorBox project](https://github.com/SourceCheckOrg/honorbox).

The application is based on the [Next.js](https://nextjs.org/) framework.

It's necessary to have the backend application (API server) running. More 
information on that can be found in the [HonorBox API](https://github.com/SourceCheckOrg/honorbox-api) repository. 


## Development environment setup

### Node.js

A recent version of Node.js is required to run the Web UI app.

We recommended using Node Version Manager [nvm](https://github.com/nvm-sh/nvm)
to install Node.js in Linux and MacOS environments.

The code was created using `v14.15.3`.

### SSI tooling

The WMS SSI project depends on SSI components developed by [Spruce
Systems](https://spruceid.com). See their [Developer
Portal](https://spruceid.dev/docs/) for more information.

The frontend application (Web UI) requires Spruce's Credible wallet for the sign
up process as well as for signing in. Any standards-conformant SSI wallet should
be usable in its place with a little effort.

### Installing HonorBox UI code

Clone this repository:
```
$ git clone https://github.com/SourceCheckOrg/honorbox-ui.git
```

Install the dependencies
```
$ cd honorbox-ui
$ npm install
```

Setup the environment variable `NEXT_PUBLIC_API_HOST` in the file
`.env.development`. It should point to the URL of the API server.


Start the Web UI:
```
$ npm run dev
```

The Web UI will be available on the following URL:

```
http://localhost:3000
```