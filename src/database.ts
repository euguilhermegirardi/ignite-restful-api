import { Knex, knex as setupKnex } from 'knex'
import { env } from './env'

// Connection with the database.
export const databaseConfig: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
}

export const knex = setupKnex(databaseConfig)
