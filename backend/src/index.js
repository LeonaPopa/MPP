const {getAllItems} = require('../repository/repository')
const express = require('express');
const dotenv = require('dotenv');
const http = require('http'); //for socket
const {Server} = require('socket.io')//for socket
dotenv.config();


const app = express();
const port = process.env.PORT;
app.use(express.json());
const { v4: uuidv4 } = require('uuid');

const httpServer = http.createServer(app);
const io = new Server(httpServer);

const cors = require('cors');
app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}));

let teas =  [];

//get all
app.get("/teas", (req, res) =>{
  res.status(200);
  res.json(getAllItems());
})

//get by id
app.get("/teas/:id", (req, res)=>{
    const tea = teas.find((n) => n.id === req.params.id);
    if (tea) {
      res.status(200).json(tea);
    } else {
      res.status(404).json({ message: "Tea not found" });
    }
})

//create
app.post("/teas/create", (req, res)=>{
   let tea = req.body;
   tea.id = uuidv4();
   teas.push(tea);
   io.emit('tea created', tea);
   res.status(201);
   res.json(tea);
});

//update
app.patch("/teas/:id",(req, res)=>{
   const teaIndex = teas.findIndex((t)=> t.id === req.params.id);
   if(teaIndex !== -1){
       teas[teaIndex] = req.body;
       io.emit('tea updated', teas[teaIndex]);
       res.status(200);
       res.json(teas[teaIndex]);
   }else
   {
       res.status(404).json({message: "Tea not found"});
   }
});

//delete
app.delete("/teas/:id", (req, res)=>{
    const teaIndex = teas.findIndex((t)=> t.id === req.params.id);
    if(teaIndex !== -1){
        teas.splice(teaIndex);
        res.status(204);
        io.emit('tea deleted', { id: req.params.id });
    }else
    {
        res.status(404).json({message: "Tea not deleted!"});
    }
});

httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

io.on('connection', socket => {
    console.log('Client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

module.exports = { app, httpServer, io };
