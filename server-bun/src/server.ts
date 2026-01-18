import { Server, ServerCredentials } from '@grpc/grpc-js';
import { env } from './environments';

const server = new Server()

const startServer = () => {
    server.bindAsync(`0.0.0.0:${env.GRPC_PORT}`, ServerCredentials.createInsecure(), (error, port) => {
        if (error) {
            console.log("Server failed to start: ", error)
            return
        }

        console.log(`gRPC Server running at 0.0.0.0:${port}.`)
    })
}

export { server, startServer }