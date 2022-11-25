const express = require("express");
require("dotenv").config();
const ROUTE = require("./Routes/Route");
const morgan = require("morgan");
const cors = require("cors");
const cookie = require("cookie-parser");
const { verifieTokenJWT, verifieToken } = require("./Controllers/Token");
const ROUTE_POST = require("./Routes/RoutePost");
require("./Data/Data");
const path = require('path');
const app = express();

const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);

const option = {
  
  origin: process.env.CLIENT,
  methods: ["GET", "PUT", "PATCH" , "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "access_token"],
  credentials: true,
  exposedHeaders: ["access_token"],
  }

const socketIO = new Server(server, {cors:{option}});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

  app.use(
    cors(option)
    );
    app.use(cookie());
    
    app.use("*", verifieToken);
    app.use("/jwt", verifieTokenJWT);
    app.use("/api", ROUTE);
    app.use("/api", ROUTE_POST);
   
  
    socketIO.on('connection', (socket) => {
     
      socket.on('entrer_groupe', (groupe)=>{
        socket.join(groupe)
      })

      socket.on('message', (msg)=>{
        socketIO.in(msg.groupe).emit('sever_message', msg)
      })

      socket.on('sortie_groupe', (groupe)=>{
        socket.leave(groupe)
      })

      socket.on('user_connect', msg =>{
        if(!ActiveUser.some(user=> user.id === msg.id)){
          ActiveUser.push({
            userId : msg.id,
            socketId : socket.id
          })
          socketIO.emit('server_user_connect', ActiveUser)
        }
      }) 

  });
    const port = process.env.PORT || 5000;
   server.listen(port, () => console.log(`Server connecté au port ${port}!`));
    