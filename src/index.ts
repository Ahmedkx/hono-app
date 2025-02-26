import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
  age: z.number().int().positive().optional(),
}).partial() // Make all fields optional for GET

app.get('/users', async (c) => {
  try {
    const queryParams = c.req.query() // Get query parameters

    // Validate query parameters
    const validatedQuery = userSchema.parse(queryParams)

    console.log(validatedQuery)
    return c.json({ message: 'User data retrieved', user: validatedQuery }, 200)

  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      return c.json({ errors }, 400)
    }

    return c.json({ error: 'An unexpected error occurred' }, 500)
  }
})

export default app