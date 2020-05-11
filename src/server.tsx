import * as React from "react";
import express from "express";
import { renderToStaticNodeStream, renderToStaticMarkup } from "react-dom/server";

const SERVER_PORT = 9000;

const server = express();

const App = () => {
  const somethingError = () => {
    console.log(`Access window object in nodejs: ${window.location.href}`);
  };
  somethingError();
  return (
    <html lang="en">
      <head>
        <title>React SSR Streaming Error Handle</title>
      </head>
      <body>
        <h1>Hello world!</h1>
      </body>
    </html>
  );
};

server.get("/sample1", (req: express.Request, res: express.Response) => {
  const stream = renderToStaticNodeStream(<App />);
  res.type("html");
  res.write("<!DOCTYPE html>");
  stream.pipe(res, { end: true });
  stream.on("error", (error) => {
    res.status(500);
    res.setHeader("Custom-Error-Code", "REACT:RENDER_TO_STATIC_NODE_STREAM_ERROR");
    res.write(`<pre><code>${error.stack}</code></pre>`);
    res.end();
  });
});

server.get("/sample2", (req: express.Request, res: express.Response) => {
  try {
    res.type("html");
    res.write("<!DOCTYPE html>");
    const html = renderToStaticMarkup(<App />);
    res.write(html);
  } catch (error) {
    res.status(500);
    res.setHeader("Custom-Error-Code", "REACT:RENDER_TO_STATIC_NODE_STREAM_ERROR");
    res.send(`<pre><code>${error.stack}</code></pre>`);
  }
});

server.listen(SERVER_PORT, () => {
  console.log(`Serve start: http://localhost:${SERVER_PORT}`);
});
