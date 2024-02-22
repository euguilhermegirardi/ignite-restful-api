import fastify from 'fastify'
import { knex } from './database'

const server = fastify()

server.get('/agoravai', async () => {
  const transactions = await knex('transactions')
    // .insert({
    //   id: randomUUID(),
    //   title: 'Testing...',
    //   amount: 9999,
    // })
    // .returning('*')
    .where('amount', 999)
    .select('*')

  return transactions
})

server
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('It is a live!!!')
  })
