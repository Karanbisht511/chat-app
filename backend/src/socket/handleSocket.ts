import { Server } from "socket.io";
import { corsOptions, server } from "../index";
import { User } from "../Model/user";
import { UserMsg } from "../Model/message";

export const runSockets = () => {

    try {
        const io = new Server(server, {
            cors: corsOptions
        });

        let usersMap = new Map();
        let liveUsers = new Map();
        // let liveGroups = []
        let newLiveGroup: string;
        let currentUser: string;
        io.on('connection', (socket) => {

            socket.on('chat message', (data) => {
                const { message, from, toSend } = data;
                if (data.isGroupChat === true) {
                    // groupChat

                } else {
                    //    one2one chat
                    console.log("toSend:", toSend);

                    io.to(usersMap.get(toSend)).emit('chat message', { message, from });
                }
            });

            // socket.on('register user', async (user) => {
            //     console.log('Received username:', user);

            //     try {
            //         // Map the user to their socket ID
            //         console.log(`user:socket.id ${user}:${socket.id}`);

            //         usersMap.set(user, socket.id);
            //         // Validate in DB if the user already exists or fetch active users
            //         currentUser = user;
            //         const activeUsers = await User.find({ active: true });
            //         if (activeUsers.length === 0) {
            //             console.log('No active users found in the database.');
            //         } else {
            //             console.log('Active users:', activeUsers);
            //         }

            //         // Emit a message back to the user

            //         io.emit('active users', activeUsers);

            //     } catch (error) {
            //         console.error('Error during database operation:', error);
            //         // Optionally, emit an error to the client
            //         io.to(socket.id).emit('error', { message: 'Failed to register user. Please try again.' });
            //     }
            // });

            socket.on('When user login', async (user) => {
                console.log('Received username:', user);

                try {
                    // Map the user to their socket ID
                    console.log(`user:socket.id ${user}:${socket.id}`);
                    liveUsers.set(user, socket.id);

                    // Validate in DB if the user already exists or fetch active users
                    currentUser = user;

                    // Make the user status active
                    await User.findOneAndUpdate({ username: user }, { active: true })

                    //get the active user list
                    const activeUsers = await User.find({ active: true });

                    if (activeUsers.length === 0) {
                        console.log('No active users found in the database.');
                    } else {
                        console.log('Active users:', activeUsers);
                    }

                    // push active users to live users
                    io.emit('active users', activeUsers);

                    const unreadMsgs = await UserMsg.findOne({ username: user });
                    console.log('undelivered messages:', unreadMsgs);

                    io.to(liveUsers.get(user)).emit('undelivered messages', { message: unreadMsgs })
                } catch (error) {
                    console.error('Error during database operation:', error);
                    // Optionally, emit an error to the client
                    io.to(socket.id).emit('error', { message: 'Failed to register user. Please try again.' });
                }
            });

            //             socket.on('listening for groupChats', async (data) => {
            //                 const { groupName } = data;
            //                 newLiveGroup = groupName;
            //                 io.emit('newlive group', { groupName });
            //             })

            //             socket.on(`${newLiveGroup} message`, () => {
            // socket.
            //             })

            socket.on('disconnect', async () => {

                try {
                    console.log('current User:', currentUser);
                    if (currentUser) {
                        console.log(await User.findOneAndUpdate({ username: currentUser }, { active: false })
                        );

                        console.log('user disconnected');
                        let activeUser = await User.find({ active: true });
                        console.log('active user:', activeUser);

                        io.emit('active users', activeUser);
                    }
                } catch (error) {
                    console.error('Error disconnect:', error);
                }
            })
        })

    } catch (error) {
        console.error('Error adding record:', error);
    }

}
