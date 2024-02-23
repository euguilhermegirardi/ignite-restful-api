import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'

// Use "zod" to validate the request.body and make sure of what we are receiving from the FE.
// If the FE is sending a right request.body.
export async function transactionsRoutes(server: FastifyInstance) {
  // The users should be able to list all transactions that already happened;
  server.get('/', async () => {
    const transactions = await knex('transactions').select()

    return { transactions }
  })

  // The users should be able to visualize a unique transaction;
  server.get('/:id', async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getTransactionParamsSchema.parse(request.params)

    // .first() = if I don't use it, "transaction" would be an array
    const transaction = await knex('transactions').where('id', id).first()

    return { transaction }
  })

  server.get('/summary', async () => {
    const summary = await knex('transactions')
      .sum('amount', { as: 'amount' })
      .first()

    return { summary }
  })

  // The users should be able to create a new transaction;
  // The transaction could be as a credit type (will sum up the total value), or as a debit type;
  // reply = response
  server.post('/', async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(['credit', 'debit']),
    })

    // .parse() checks if the request.body has the correct properties.
    // if not, .parse() will throw an new Error and stop everything below.
    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body,
    )

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      amount: type === 'credit' ? amount : amount * -1,
    })

    reply.status(201).send({ message: 'POST - WORKED!' })
  })
}
