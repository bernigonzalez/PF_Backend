const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');
const { errorHandler, error404 } = require('./middlewares/index.js');
const { CORS_URL } = process.env;



require('./db.js');

 
const app = express();
const http = require("http")
const {Server} = require("socket.io")

const server = http.createServer(app) //creamos un http server con express

const io = new Server(server, {
  cors: {
    origin: CORS_URL,
    methods: ["GET", "POST", "PUT", "UPDATE", "DELETE"]
  }
})

app.name = 'API';

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Configuración CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', CORS_URL); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers-Origin, Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.use('/', routes);

// Error catching endware.
app.use('*', error404);
app.use(errorHandler);


let users = []

//----------------------------------------------------------------------------Helper Add user (when connect)
const addUser = async (userId, socketId) => {
  var flat = true;
  for (let i = 0; i < users.length; i++) {
    if (users[i].userId === userId) {
      flat = false;
    }
  }
  if (flat) {
    users.push({ userId: userId, socketId: socketId });
  }
};

//----------------------------------------------------------------------------Helper Remove user (when disconnect)
const removeUser =  async (socketId) => {
  if (socketId) {
    users = users.filter((user) => user.socketId !== socketId);
  }
};

//----------------------------------------------------------------------------Helper Find a user (to send a message)
const getUser = (userId) => {
  return users.find(user => user.userId === userId)
}

io.on("connection", async (socket) => {
    console.log("user connected:" +  socket.id)

    

    socket.emit("event_welcome", "hello this is socket server")

    
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id)
    })
 
    socket.on("join_room", (data) => {
      socket.join(data)
      console.log("User Join Chat number: ", data)
    })

    socket.on("send_message", (data) => { //escuchamos al evento "send_message", recibimos la data y la enviamos al cliente neuvamente
      console.log("han enviado el siguiente mensaje: ", data)  
      socket.to(data.room).emit("receive_message", data) //mandamos la data del mensaje a otros usuarios, que van a estar escuchando en el front el evento 
    })

    socket.on("newConversation", (admin) => {
      console.log("llego evento newConversation")
        io.emit("newConversation", admin)
    })
} )

module.exports = server;