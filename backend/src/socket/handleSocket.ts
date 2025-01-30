import { Server } from "socket.io";
import { server } from "../index";
import { User } from "../Model/user";
import { UserMsg } from "../Model/message";
import { saveMessageToDB } from "../DB/messages";
import { Request, Response } from "express";

const ioHandler = (req: Request, res: Response) => {
  const socket = res.socket as any;

  if (!socket.server.io) {
    runSockets(res);
  }
  res.end();
};

export default ioHandler;

const runSockets = (res: Response) => {
  try {
    const io = new Server(server, {
      path: "/api/socketio",
      addTrailingSlash: false,
      cors: {
        origin: "*", // Allow all origins (use '*' for open access or specify specific origins)
        methods: ["GET", "POST"], // Allow only these HTTP methods
        allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
        credentials: true, // Allow credentials (cookies, authorization headers)
      },
    });
    const socket = res.socket as any;
    socket.server.io = io;
    let liveUsers = new Map<string, string>();
    let currentUser: string;
    io.on("connection", async (socket) => {
      console.log("socketId:", socket.id);

      socket.on("chat message", async (data) => {
        console.log("---------chat message-----------");
        console.log("liveUsers:", liveUsers);
        const { message, from, toSend, isGroup } = data;
        console.log("chat message listener");
        currentUser = from;
        // console.log("data:", JSON.stringify(data));
        if (isGroup) {
          console.log("group chat message");

          io.to(toSend).emit("--receive message--", { message, from });
        } else {
          //    one2one chat
          console.log("one to one chat message");
          const receiverSocket = liveUsers.get(toSend);
          console.log("Receiver socket found:", receiverSocket);
          if (receiverSocket) {
            console.log(`Emitting to socket: ${receiverSocket}`);
            const data = { message, from };
            console.log("data:", data);

            io.to(receiverSocket).emit("--receive message--", {
              message,
              from,
            });
          } else {
            console.log(`No active socket found for user: ${toSend}`);
          }
          await saveMessageToDB(`${from}to${toSend}`, message, from);
        }
      });

      socket.on("file transfer", async (file, { username, toSend }) => {
        console.log("file:", file);
        console.log("current user:", username);
        let from = username;
        let message = file;
        await saveMessageToDB(`${from}to${toSend}`, message, from);
      });

      socket.on("When user login", async (user) => {
        console.log("----------When user login------");
        console.log("Received username:", user);

        try {
          // Map the user to their socket ID
          console.log(`user:socket.id ${user}:${socket.id}`);
          liveUsers.set(user, socket.id);
          console.log("liveUsers:", liveUsers);
          // Validate in DB if the user already exists or fetch active users
          currentUser = user;

          // Make the user status active
          await User.findOneAndUpdate({ username: user }, { active: true });

          //get the active user list
          const activeUsers = await User.find({ active: true });

          if (activeUsers.length === 0) {
            console.log("No active users found in the database.");
          } else {
            // console.log('Active users:', activeUsers);
          }

          // push active users to live users
          io.emit("active users", activeUsers);

          const unreadMsgs = await UserMsg.findOne({ username: user });
          // console.log('undelivered messages:', unreadMsgs);

          io.to(liveUsers.get(user)).emit("undelivered messages", {
            message: unreadMsgs,
          });
        } catch (error) {
          console.error("Error during database operation:", error);
          // Optionally, emit an error to the client
          io.to(socket.id).emit("error", {
            message: "Failed to register user. Please try again.",
          });
        }
      });

      socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`${socket.id} joined group:${room}`);
      });

      socket.on("disconnect", async () => {
        console.log("--------disconnect event--------");

        try {
          console.log("current User:", currentUser);
          if (currentUser) {
            console.log(
              await User.findOneAndUpdate(
                { username: currentUser },
                { active: false }
              )
            );

            console.log("user disconnected");
            let activeUser = await User.find({ active: true });
            // console.log('active user:', activeUser);

            io.emit("active users", activeUser);
          }
        } catch (error) {
          console.error("Error disconnect:", error);
        }
      });
    });
  } catch (error) {
    console.error("Error adding record:", error);
  }
};
