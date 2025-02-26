import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(), // Example of an optional field
  age: z.number().int().positive().optional() // Optional positive integer
})

app.post('/users', async (c) => {
  try {
    const body = await c.req.json()
    const validatedBody = userSchema.parse(body) // Throws an error if validation fails

    // validatedBody now contains the validated data
    console.log(validatedBody)
    return c.json({ message: 'User created', user: validatedBody }, 201)

  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
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