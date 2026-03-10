console.log("server.ts: starting");

import { createApp } from "./app";

console.log("server.ts: createApp imported");

const app = createApp();

const port = Number(process.env.PORT || 3001);

app.listen(port, "0.0.0.0", () => {
  console.log(`deterministic-api-testbed listening on port ${port}`);
});

console.log("server.ts: app created, calling listen");

app.listen(port, "127.0.0.1", () => {
  console.log(`deterministic-api-testbed listening on http://127.0.0.1:${port}`);
});