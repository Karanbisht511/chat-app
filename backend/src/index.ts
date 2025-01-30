import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
// import ioHandler from "./socket/handleSocket";
import indexRoute from "./Route/indexRoute";
import { connectMongo } from "./dbConfig";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create server but don't start listening yet
export const server = http.createServer(app);
connectMongo();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello world" });
});

app.use("/api", indexRoute);

// Only start the server in development
if (process.env.NODE_ENV !== "production") {
  server.listen(process.env.PORT || 9000, () => {
    console.log("listening on *:9000");
  });
}

// Export the Express app for Vercel
export default app;
