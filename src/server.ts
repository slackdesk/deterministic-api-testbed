console.log("server.ts: starting");

import { createApp } from "./app";

console.log("server.ts: createApp imported");

const port = Number(process.env.PORT || 3001);
const app = createApp();

console.log("server.ts: app created, calling listen");

app.listen(port, "127.0.0.1", () => {
  console.log(`deterministic-api-testbed listening on http://127.0.0.1:${port}`);
});