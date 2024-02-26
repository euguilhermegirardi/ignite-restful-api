import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

// envSchema.parse = do a validation to check if the DATABASE_URL is a string or not.
// if it's okay the code keeps going after this variable.
// avoiding then a if statement to check if the DATABASE_URL has a string or it's undefined
// parse triggers an error, safeParse does not so it's possible to create our own error and not use Zod error message
const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('Invalid environment variables!', _env.error.format)

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
