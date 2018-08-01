# STRV Address Book API

Hi. You're gonna find all information you need to setup this project either on your computer or on any unix server.

## Getting Started

First of all, you'll need `npm` installed globally. After this, run:

```
npm install --production
```

The code above will install all the project production dependencies. For you to see this project going on, just run:

```
npm start
```

So, accessing `http://localhost:3000` you'll see this api homepage. The API resources can be accessed through `/api/v1` path. The resources are documented below.

### Development Mode

Of course we'll need to update this project, or not, but if we do, you can run into development mode, without restart any time you change your code:

First, install all the development dependencies running:

```
npm install
```

If we're not on heroku environment, we'll need to setup the environment variables. To do this, duplicate the `./env.example.js` file and rename it to `env.js`. Replace the required variables. 

And then just run:

```
npm run dev
```

#### Port

You can also run this project in your own custom port. Just assign a port number when starting the app:

```
PORT=<port-number> npm start
PORT=<port-number> npm run dev
```

E.g.:

```
PORT=8000 npm start
```

Accessing on browser through this url: `http://localhost:8000`.

## Documentation

We've documented this project on [Swagger](https://app.swaggerhub.com/apis/nncl/strv-address-book).
