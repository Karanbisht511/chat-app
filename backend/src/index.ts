import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import { runSockets } from "./socket/handleSocket";
import indexRoute from "./Route/indexRoute";
import { connectMongo } from "./dbConfig";
import dotenv from "dotenv";
dotenv.config();
import path from "path";

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

// Create server but don't start listening yet
export const server = http.createServer(app);
connectMongo();
runSockets();

app.use("/api", indexRoute);

const _dirname1 = path.resolve();
console.log("dirname:", _dirname1);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(_dirname1, "../chat-app/dist")));
  app.get("*", (req, res) => {
    const resolvedPath = path.resolve(
      _dirname1,
      "../chat-app",
      "dist",
      "index.html"
    );
    console.log("path:", resolvedPath);

    res.sendFile(resolvedPath);
  });
} else {
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "backend is running" });
  });
}

// Only start the server in development
// if (process.env.NODE_ENV !== "production") {
server.listen(process.env.PORT || 9000, () => {
  console.log("listening on *:9000");
});
// }

// Export the Express app for Vercel
export default app;
