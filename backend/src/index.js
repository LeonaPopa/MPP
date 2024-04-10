//import {getAllItems} from "../repository/repository";
const {getAllItems} = require('../repository/repository')
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(express.json());
const { v4: uuidv4 } = require('uuid');

const cors = require('cors');
app.use(cors());

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
   res.status(201);
   res.json(tea);
});
//update
app.patch("/teas/:id",(req, res)=>{
   const teaIndex = teas.findIndex((t)=> t.id === req.params.id);
   if(teaIndex !== -1){
       teas[teaIndex] = req.body;
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
    }else
    {
        res.status(404).json({message: "Tea not deleted!"});
    }
});

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

module.exports = server;
