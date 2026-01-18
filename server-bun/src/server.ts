import { Server, ServerCredentials } from '@grpc/grpc-js'
import { env } from './environments'
import { StockPriceServiceService } from './generated/stockprice'
import stockPriceServiceImpl from './services/stockprice.service'

const server = new Server()

server.addService(StockPriceServiceService, stockPriceServiceImpl)

const startServer = () => {
  server.bindAsync(`0.0.0.0:${env.GRPC_PORT}`, ServerCredentials.createInsecure(), (error, port) => {
    if (error != null) {
      console.log('Server failed to start: ', error)
      return
    }

    console.log(`gRPC Server running at 0.0.0.0:${port}.`)
  })
}

export { server, startServer }
