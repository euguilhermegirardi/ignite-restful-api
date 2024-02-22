import { Knex, knex as setupKnex } from 'knex'

// Connection with the database.
export const databaseConfig: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: '.database.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
}

export const knex = setupKnex(databaseConfig)
