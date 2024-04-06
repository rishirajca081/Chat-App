const express=require("express");
const app=express();
const http=require("http");

const formateMessage=require('./utils/messages');
const {userJoin, getCurrentUser,userLeave,getRoomUsers}=require("./utils/user");

const server=http.createServer(app);
const socketio=require("socket.io");
const io=socketio(server);


const port=3000||process.env.PORT;
const path=require("path");

app.use(express.static(path.join(__dirname,"public")));

const botName="chatBot";

//run when client connects
io.on("connection",(socket)=>{
    
    socket.on("joinRoom",({username,room})=>{

        const user=userJoin(socket.id,username,room);
    
    
        socket.join(user.room);

        console.log("New Web Server Connection...");

    socket.emit("message",formateMessage(botName,"Welcome to ChatCord"));


    //broadcasting the msg
    socket.broadcast.to(user.room).emit(
    'message',
    formateMessage(botName,`${user.username} has joined the chat`)
    );

//user and room info...

    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users: getRoomUsers(user.room),
    });
   
});

    //chat listen
    socket.on('chatMessage',(msg)=>{
        //server pr msg catch 

        const user=getCurrentUser(socket.id);
        console.log(msg);
       io.to(user.room).emit('message',formateMessage(user.username,msg));
    })


    socket.on('disconnect',()=>{
        const user=userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formateMessage(botName,`${user.username} has left the chat`));
             

            //user and room info
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getCurrentUser(user.room)
            });
       
        }


       // io.emit('message',formateMessage(botName,'A user has left the chat'));
    });

});
server.listen(port,()=>{
    console.log("server started...");
})
