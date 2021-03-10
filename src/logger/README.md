# Logging server

Logs are sent to be logged in a browser console over a websocket connection.

The websocket server is served on an express app.
- https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server

The websocket connection is made by a basic html/js webapp, located at [client/](./client/). These static files are served from [the express server](./server.js)
- https://expressjs.com/en/starter/static-files.html