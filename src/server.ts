import app from "./app.js";
import {env} from "./config/env.js";
import {pool} from "./db/index.js";

await pool.query("SELECT 1");

const server = app.listen(env.PORT, (error) => {
    if (error) throw error;
    // oxlint-disable-next-line no-console -- asendub pino logijaga (issue 44)
    console.log(`Server running at http://localhost:${env.PORT}`);
});

let isShuttingDown = false;

async function shutdown(signal: string) {
    if (isShuttingDown) return;
    isShuttingDown = true;
    // oxlint-disable-next-line no-console -- asendub pino logijaga (issue 44)
    console.log(`${signal} received, shutting down...`);

    setTimeout(() => process.exit(1), 8000).unref();

    await new Promise((resolve) => server.close(resolve));
    await pool.end();
    process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
