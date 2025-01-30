"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const handleSocket_1 = require("./socket/handleSocket");
const indexRoute_1 = __importDefault(require("./Route/indexRoute"));
const dbConfig_1 = require("./dbConfig");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Create server but don't start listening yet
exports.server = http_1.default.createServer(app);
(0, dbConfig_1.connectMongo)();
app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello world" });
});
app.use("/api", indexRoute_1.default);
(0, handleSocket_1.runSockets)();
// Only start the server in development
if (process.env.NODE_ENV !== 'production') {
    exports.server.listen(process.env.PORT || 9000, () => {
        console.log("listening on *:9000");
    });
}
// Export the Express app for Vercel
exports.default = app;
