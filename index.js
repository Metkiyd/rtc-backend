import express from 'express'
import { createServer } from 'http'
import dotenv from 'dotenv'
import cors from 'cors'
import { Server } from 'socket.io'

dotenv.config()

const app = express()
const httpServer = createServer(app)

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
}

app.use(cors(corsOptions))

const io = new Server(httpServer, {
  cors: corsOptions,
})

app.use(express.json())

const rooms = new Map()

app.get('/rooms', function (req, res) {
  res.json(rooms)
})

app.post('/rooms', (req, res) => {
  const { roomId, userName } = req.body
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ['users', new Map()],
        ['messages', []],
      ]),
    )
  }
  // res.json([...rooms])
  res.send()
})

io.on('connection', (socket) => {
  socket.on('ROOM:JOIN', ({ roomId, userName }) => {
    socket.join(roomId)
    rooms.get(roomId).get('users').set(socket.id, userName)
    const users = [...rooms.get(roomId).get('users').values()]
    socket.broadcast.to(roomId).emit('ROOM:JOINED', users)
  })
  console.log(`user ${socket.id} connected`)

  // socket.emit('foo', 'bar')

  // socket.on('userFromClient', ({ id }) => {
  //   socket.broadcast.emit('userFromServer', { id })
  //   // const users = getUsers()
  // })

  socket.on('disconnect', (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`)
  })
})

const PORT = process.env.PORT || 8000

httpServer.listen(PORT, (error) => {
  if (error) {
    return console.log(error)
  }
  console.log(`Server started on port: ${PORT}`)
})
