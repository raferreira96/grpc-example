import grpc, { type ServiceError } from '@grpc/grpc-js'
import type { StockPriceServiceServer } from '../generated/stockprice'

// Implementação simples do serviço: valida symbol, gera um preço fictício e responde com timestamp.
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
        timestamp: new Date().toISOString()
      }

      callback(null, response)
    } catch (e) {
      const err: Error & { code: any } = Object.assign(new Error('Internal server error'), {
        code: grpc.status.INTERNAL
      })
      callback(err, null as any)
    }
  }
}

export default stockPriceServiceImpl
