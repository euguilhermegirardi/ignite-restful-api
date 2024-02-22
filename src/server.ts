import fastify from 'fastify'
import { env } from './env'
import { transactionsRoutes } from './routes/transactions'

const server = fastify()

// The plugins order is important!
server.register(transactionsRoutes, {
  // prefix config
  prefix: 'transactions',
})

server
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('It is a live!!!')
  })
