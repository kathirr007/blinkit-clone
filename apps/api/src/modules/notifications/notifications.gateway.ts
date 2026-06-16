import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  private userSockets = new Map<string, Set<string>>()

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string
    if (userId) {
      client.join(`user:${userId}`)
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set())
      }
      this.userSockets.get(userId)!.add(client.id)
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId)!.delete(client.id)
      if (this.userSockets.get(userId)!.size === 0) {
        this.userSockets.delete(userId)
      }
    }
  }

  @SubscribeMessage('order:subscribe')
  handleOrderSubscribe(client: Socket, orderId: string) {
    client.join(`order:${orderId}`)
  }

  @SubscribeMessage('order:unsubscribe')
  handleOrderUnsubscribe(client: Socket, orderId: string) {
    client.leave(`order:${orderId}`)
  }

  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data)
  }

  sendToOrder(orderId: string, event: string, data: any) {
    this.server.to(`order:${orderId}`).emit(event, data)
  }

  broadcastOrderStatus(orderId: string, status: string, data?: any) {
    this.server.to(`order:${orderId}`).emit('order:status_updated', {
      orderId,
      status,
      ...data,
    })
  }

  broadcastDeliveryLocation(orderId: string, location: { latitude: number, longitude: number }) {
    this.server.to(`order:${orderId}`).emit('delivery:location_updated', {
      orderId,
      ...location,
    })
  }
}
