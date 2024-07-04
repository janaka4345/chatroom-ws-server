import express from 'express'
import { Server } from "socket.io";
import { config } from 'dotenv';

config()
const PORT =process.env.PORT || 3500

const app=express()

const expressServer=app.listen(PORT,()=>{
    console.log(`listing on port:${PORT}`);
    
})

const io=new Server(expressServer,{
    cors:{
        origin:['http://localhost:5000']
    }
})

io.on('connection',(socket)=>{
    console.log(`connected user:${socket.id}`);
    socket.on('message',(message)=>{
        console.log(message);
        io.emit('message',`echo ${message.username}`)
    })
    
})

console.log('hisda');
