import grpc from '@grpc/grpc-js'
import type { StockPriceServiceServer } from '../generated/stockprice'

export const stockPriceServiceImpl: StockPriceServiceServer = {
  getPrice: (call, callback) => {
    try {
      const symbol = call.request?.symbol ?? ''

      if (!symbol || symbol.trim() === '') {
        const err: Error & { code: any } = Object.assign(new Error('`symbol` is required'), {
          code: grpc.status.INVALID_ARGUMENT
        })
        callback(err, null as any)
        return
      }

      let hash = 0
      for (let i = 0; i < symbol.length; i++) {
        hash = (hash * 31 + symbol.charCodeAt(i)) | 0
      }
      const base = Math.abs(hash) % 1000
      const fractional = (Math.abs(hash) % 100) / 100
      const price = Number((base + fractional + 10).toFixed(2))

      const response = {
        symbol,
        price,
        timestamp: new Date().getTime()
      }

      callback(null, response)
    } catch (e) {
      const err: Error & { code: any } = Object.assign(new Error('Internal server error'), {
        code: grpc.status.INTERNAL
      })
      callback(err, null as any)
    }
  },

  getPriceServerStreaming: (call) => {
    try {
      const symbol = call.request?.symbol ?? ''

      if (!symbol || symbol.trim() === '') {
        const err: Error & { code: any } = Object.assign(new Error('`symbol` is required'), {
          code: grpc.status.INVALID_ARGUMENT
        })
        call.emit('error', err)
        return
      }

      let hash = 0
      for (let i = 0; i < symbol.length; i++) {
        hash = (hash * 31 + symbol.charCodeAt(i)) | 0
      }
      const base = Math.abs(hash) % 1000
      const fractionalBase = (Math.abs(hash) % 100) / 100

      let sent = 0
      const maxMessages = 5
      const intervalMs = 1000

      const timer = setInterval(() => {
        if (call.cancelled) {
          clearInterval(timer)
          return
        }

        const jitter = Math.random() * 0.5
        const price = Number((base + fractionalBase + 10 + jitter).toFixed(2))

        const response = {
          symbol,
          price,
          timestamp: Date.now()
        }

        call.write(response)
        sent++

        if (sent >= maxMessages) {
          clearInterval(timer)
          call.end()
        }
      }, intervalMs)

      call.on('cancelled', () => {
        clearInterval(timer)
      })
    } catch (e) {
      const err: Error & { code: any } = Object.assign(new Error('Internal server error'), {
        code: grpc.status.INTERNAL
      })
      call.emit('error', err)
    }
  }
}

export default stockPriceServiceImpl
