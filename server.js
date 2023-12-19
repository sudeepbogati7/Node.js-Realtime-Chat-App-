const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const server = http.createServer(app);

//object formatted message
const formatMessages = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const botName = "Sudeep (Admin) ";

//load the socket.io module
const io = socketio(server);

//connection event, when a user is connected
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    // Welcome current user
    socket.emit("message", formatMessages(botName, "Welcome to Chatbook.."));

    // all the clients except the conneting client
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessages(botName, `${user.username} has joined the chat`)
      );

      //send users and room info 

      io.to(user.room ).emit('roomUsers' , {
        room: user.room, 
        users : getRoomUsers(user.room)
      });
  });

  // message from form submit
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessages(user.username, msg));
  });

  //Runs when the client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessages(botName, `${user.username} has left the chat `)
      ); // to all the clients

      // send users and room info
      io.to(use.room ).emit('roomUsers' , {
        room: user.room, 
        users : getRoomUsers(user.room)
      });
    }
  });
});



app.use(express.static(path.join(__dirname, "public")));

const port = 3000 || process.env.PORT;
const ip = "127.0.0.1";
server.listen(port, () =>
  console.log(`Server running on http:${ip}:${port}/ ...`)
);
