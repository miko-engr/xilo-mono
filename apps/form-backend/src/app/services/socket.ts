import * as socketio from 'socket.io'

let instance = null

export class SocketService {
  static Initialize (server) {
    instance = socketio(server)
    instance.on('connection', socket => {
      console.log(`Connected to socket ${socket.id}`)
    })
    instance.on('disconnect', socket => {
      console.log(`Disconnected ${socket.id}`)
      instance.disconnect()
    })

    return instance
  }

  static getInstance () {
    return instance
  }
}
