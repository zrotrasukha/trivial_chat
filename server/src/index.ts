import { Hono } from "hono";
import { logger } from "hono/logger";


const app = new Hono()

app.use(logger());
app.get("/health", (c) => c.text("yeah it is doing it's thing"));

export default app; 
