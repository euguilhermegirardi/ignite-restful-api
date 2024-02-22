import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function transactionsRoutes(server: FastifyInstance) {
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
}
