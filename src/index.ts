import { Hono } from "hono";
import { z } from "zod";
import { cors } from "hono/cors";

const app = new Hono();

// ... (CORS and logger middleware remain the same)

const authMiddleware = async (c, next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.substring(7);

    const isValidToken = token === c.env.AUTH_TOKEN; // Use c.env here

    if (!isValidToken) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    await next();
};

app.use("/users/:id", authMiddleware);

// ... (userSchema and /users route remain the same)

app.get("/env", (c) => {
    const myValue = c.env.MY_ENV_VARIABLE; // Use c.env here

    if (myValue === undefined) { // Check for undefined, not falsy
        return c.json({ message: "Environment variable not set" }, 404);
    }

    return c.json({ value: myValue }, 200);
});

// ... (rest of the code remains the same)

export default app;