import express, { Request, Response } from 'express'
// import { Server } from "socket.io";
import http from 'http';
import cors from 'cors'
import { runSockets } from './socket/handleSocket';
import indexRoute from "./Route/indexRoute"
import { connectMongo } from "./dbConfig"

const app = express();

// export const corsOptions: cors.CorsOptions = {
//     origin: ['*'], // Allowed origins
//     methods: ['GET', 'POST'], // Allowed methods
//     allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
//     credentials: true, // Allow credentials (cookies, authorization headers, etc.)
// };

app.use(cors());
app.use(express.json())
export const server = http.createServer(app)
connectMongo()
app.use("/api", indexRoute);
runSockets();

server.listen(9000, () => {
    console.log('listening on *:9000');
});
