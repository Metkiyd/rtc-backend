import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { Server } from 'socket.io'

dotenv.config()

const app = express()

const rooms = new Map()

app.get('/users', function (req, res) {
  res.json(rooms)
})

const io = new Server()

io.on('connection', (socket) => {
  console.log(`socket ${socket.id} connected`)

  socket.emit('foo', 'bar')

  socket.on('foobar', () => {})

  socket.on('disconnect', (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`)
  })
})

const PORT = process.env.PORT || 8000

app.listen(PORT, (error) => {
  if (error) {
    return console.log(error)
  }
  console.log(`Server started on port: ${PORT}`)
})
