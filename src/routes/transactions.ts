import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-sessionId-exists'

// Cookies <==> Ways to keep context between the requests

// Use "zod" to validate the request.body and make sure of what we are receiving from the FE.
// If the FE is sending a right request.body.
export async function transactionsRoutes(server: FastifyInstance) {
  // The users should be able to list all transactions that already happened;
  server.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const transactions = await knex('transactions')
        .where('session_id', sessionId)
        .select()

      return { transactions }
    },
  )

  // The users should be able to visualize a unique transaction;
  server.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getTransactionParamsSchema = z.object({ id: z.string().uuid() })
      const { id } = getTransactionParamsSchema.parse(request.params)
      const { sessionId } = request.cookies

      // .first() = if I don't use it, "transaction" would be an array
      const transaction = await knex('transactions')
        .where({
          session_id: sessionId,
          id,
        })
        .first()

      return { transaction }
    },
  )

  // The users should be able to generate a resume of their bank account (transactions total value);
  server.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const summary = await knex('transactions')
        .where({
          session_id: sessionId,
        })
        .sum('amount', { as: 'amount' })
        .first()

      return { summary }
    },
  )

  // The users should be able to create a new transaction;
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

    // It should be possible to identify the user between transactions;
    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('transactions').insert({
      id: randomUUID(),
      title,
      // The transaction could be as a credit type (will sum up the total value), or as a debit type;
      amount: type === 'credit' ? amount : amount * -1,
      session_id: sessionId,
    })

    reply.status(201).send({ message: 'POST - WORKED!' })
  })
}
