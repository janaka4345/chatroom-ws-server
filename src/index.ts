import express from 'express'
import { Server } from "socket.io";
import { config } from 'dotenv';
import prisma from './prismaClient';

config()
const PORT =process.env.PORT || 3000

const app=express()

const expressServer=app.listen(PORT,()=>{
    console.log(`listing on port:${PORT}`);
    
})

const io=new Server(expressServer,{
    cors:{
        // origin:['https://chatter.janakakariyawasam.xyz','http://localhost:5000']
        origin:['https://chatter.janakakariyawasam.xyz']
    }
})

// io.on('connection',(socket)=>{
//     console.log(`connected user:${socket.id}`);
//     socket.on('message',(message)=>{
//         console.log(message);
//         io.emit('message',`echo ${message.username}`)
//     })
    
// })
io.on('connection', (socket) => {
        //listnenig for the message event
        // socket.on('message', (data) => {
        //   // console.log('connected', data);
        //   io.emit('message', `${data}`)

        // })
        //listnenig for the revalidate event
        console.log(`connected user:${socket.id}`)

        socket.on('revalidateAll', (data) => {
            // console.log('connected', data);
            io.emit('revalidateAll', 'revalidate all'); //TODO edit message
        });

        socket.on('revalidateUser', (data) => {
            socket.emit('revalidateUser', ''); //TODO edit message
            socket.to(data.socketId).emit('userMessage', data); //TODO edit message
        });

        socket.on('revalidateUserForRequest', (data) => {
            socket.emit('revalidateUser', ''); //TODO edit message
            socket.to(data.socketId).emit('userRequest', data); //TODO edit message
        });

        socket.on('revalidateUserForRequestAccept', (data) => {
            socket.emit('revalidateUser', ''); //TODO edit message
            socket.to(data.socketId).emit('userRequestAccepted', data); //TODO edit message
        });

        //listnenig for the disconnect event
        socket.on('disconnect', async (data) => {
            // console.log('disconnected', data);
            socket.broadcast.emit('revalidateAll', '');
            await prisma.user.updateMany({
                where: {
                    socketId: socket.id,
                },
                data: {
                    socketId: null,
                    status: false,
                },
            });
        });
    });
