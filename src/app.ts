import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { transactionsRoutes } from './routes/transactions'

export const app = fastify()

// The plugins order is important!
app.register(cookie)

app.register(transactionsRoutes, {
  // prefix config
  prefix: 'transactions',
})
