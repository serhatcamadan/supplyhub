import { io, type Socket } from 'socket.io-client'
import { getAccessToken } from '@/lib/api/client'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

export function connectAuctionSocket(): Socket {
  return io(`${API_URL}/auctions`, {
    auth: { token: getAccessToken() },
    transports: ['websocket'],
  })
}
