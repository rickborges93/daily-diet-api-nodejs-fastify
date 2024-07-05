import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const meals = await knex('meals')
        .where({ user_id: request.userId })
        .orderBy('date', 'desc')

      return reply.status(200).send({ meals })
    },
  )

  app.get(
    '/metrics',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const meals = await knex('meals')
        .where({ user_id: request.userId })
        .orderBy('date', 'desc')

      const { mealsOnDiet, mealsOffDiet, bestSequence } = meals.reduce(
        (acc, meal) => {
          if (meal.is_on_diet) {
            acc.mealsOnDiet = acc.mealsOnDiet + 1
            acc.sequence = acc.sequence + 1
          } else {
            acc.mealsOffDiet = acc.mealsOffDiet + 1
            acc.sequence = 0
          }

          if (acc.sequence > acc.bestSequence) {
            acc.bestSequence = acc.sequence
          }

          return acc
        },
        { mealsOnDiet: 0, mealsOffDiet: 0, bestSequence: 0, sequence: 0 },
      )

      return reply.status(200).send({
        quantity: meals.length,
        mealsOnDiet,
        mealsOffDiet,
        bestSequence,
      })
    },
  )

  app.get(
    '/:mealId',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const paramsMealSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = paramsMealSchema.parse(request.params)

      const meal = await knex('meals')
        .where({ id: mealId, user_id: request.userId })
        .first()

      return reply.status(200).send({ meal })
    },
  )

  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { name, description, isOnDiet, date } = createMealBodySchema.parse(
        request.body,
      )

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(),
        user_id: request.userId,
      })

      return reply.status(201).send()
    },
  )

  app.put(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsMealSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = paramsMealSchema.parse(request.params)

      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        isOnDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { name, description, isOnDiet, date } = createMealBodySchema.parse(
        request.body,
      )

      const meal = await knex('meals')
        .where({ id: mealId, user_id: request.userId })
        .first()

      if (!meal) {
        return reply.status(400).send({
          message: 'Meal not found',
        })
      }

      await knex('meals').where({ id: mealId }).update({
        name,
        description,
        is_on_diet: isOnDiet,
        date: date.getTime(),
        updated_at: knex.fn.now(),
      })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsMealSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = paramsMealSchema.parse(request.params)

      const meal = await knex('meals')
        .where({ id: mealId, user_id: request.userId })
        .first()

      if (!meal) {
        return reply.status(400).send({
          message: 'Meal not found',
        })
      }

      await knex('meals').where({ id: mealId }).delete()

      return reply.status(204).send()
    },
  )
}
