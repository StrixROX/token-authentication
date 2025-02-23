# Token-Based Authentication

This is a simple authentication server that uses JWTs for authentication.
It is designed to be used with the frontend of a web application.

> **NOTE**: This project has two parts, the backend `API` and the user-facing `Client`. The `api` and `client` branches contain the code for each of them, respectively.

## Usage

1. Install the dependencies: `npm install`
2. Run the server: `npm start`
3. The server will listen on port 3000 by default.

## Configuration

The server can be configured by setting environment variables. The following environment variables are supported:

- `NODE_ENV`: The environment to run the server in. Possible values are "development" and "production". Default is "development".
- `PORT`: The port to listen on. Default is 3000.
- `MONGO_URI`: The URI of the MongoDB database to connect to.
- `CLIENT_ORIGIN`: The origin of the client that is allowed to access the server.
- `JWT_SECRET`: The secret to use for signing JWTs.
- `JWT_REFRESH_SECRET`: The secret to use for signing refresh tokens.
- `EMAIL_SENDER`: The email address to use when sending emails.
- `RESEND_API_KEY`: The API key to use with the Resend service.

You can set the configuration options in a `.env` file. The server will load the configuration from the file if it exists.